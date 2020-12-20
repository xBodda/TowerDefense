var TowerDefense = { 

    gameWidth: window.innerWidth,
    gameHeight: window.innerHeight,

    objects: [],
    grid: [], 
    gridPath: [], 
    nodes: [], 

    scene: {},
    camera: {},
    renderer: {},
    projector: {},
    manager: {},

    controls: {},

    meshObjects: [],
    meshTextures: [],

    clock: new THREE.Clock(),

    config: {

        maxRange: 100, // Max range of a tower,
        maxSpeed: 50, // Interval in ms for shooting bullets
        maxDamage: 50 // Max damage for bullet impact

    },

    availableTowers: [
        {
            object: function() { return new TowerDefense.BasicTower(); }
        },
    ],

    startTile: {},

    endTile: {},

    selectedObject: {},

    time: Date.now(),
    counter: 0,

    FindPath: new Worker("js/TowerDefense/Core/Worker.PathFinder.js"),
    
    initialize: function() {

        // FindPath WebWorker
        this.FindPath.addEventListener("message", function (oEvent) {
            if (oEvent.data.returnAttributes != null && oEvent.data.returnAttributes.moveObject != null && TowerDefense.objects[oEvent.data.returnAttributes.moveObject] != null) {
                TowerDefense.objects[oEvent.data.returnAttributes.moveObject].move(oEvent.data.path);
            }
            if (oEvent.data.returnAttributes != null && oEvent.data.returnAttributes.buildTower != null) {
                var tower = TowerDefense.availableTowers[oEvent.data.returnAttributes.buildTower].object();
                tower.create();
                tower.spawn(TowerDefense.selectedObject);
                // TowerDefense.stats.resources -= tower.stats.costs;
                tower.add();
                TowerDefense.Ui.selectedTower = null;
                TowerDefense.Ui.hideBuildMenu();
            }
        }, false);

        this.manager = new THREE.LoadingManager();


        TowerDefense.Ui.initialize();

    },

    reset: function() {
        this.objects = [];
        if (gameRender != null) {
            window.cancelAnimationFrame(gameRender);
        }
        TowerDefense.scene = null;
        TowerDefense.renderer = null;
        TowerDefense.projector = null;
        TowerDefense.camera = null;

    },

    loadObjects: function(callback) {

        var meshLoader = new THREE.OBJLoader( this.manager );
        var textureLoader = new THREE.ImageLoader( this.manager );

        var totalLoaded = 0;

        this.meshObjects.forEach (function (mesh) {
            var key = mesh.key;
            if (TowerDefense.meshObjects[key] == null) {
                TowerDefense.meshObjects[key] = {};
            }
            if (mesh.object == null || mesh.object == '') {
                totalLoaded++;
                TowerDefense.meshObjects[key].object = '';
                meshLoader.load( mesh.file + '?t=' + Date.now(), function ( object ) {
                    TowerDefense.meshObjects[key].object = object.children[0];
                    totalLoaded--;
                    finishLoading();
                } );
            }
        });

        this.meshTextures.forEach (function (texture) {
            var key = texture.key;
            if (TowerDefense.meshTextures[key] == null) {
                TowerDefense.meshTextures[key] = {};
            }
            if (texture.texture == null || texture.texture == '') {
                totalLoaded++;
                TowerDefense.meshTextures[key].texture = new THREE.Texture();
                textureLoader.load( texture.file, function ( image ) {

                    TowerDefense.meshTextures[key].texture.image = image;
                    TowerDefense.meshTextures[key].texture.needsUpdate = true;

                    totalLoaded--;
                    finishLoading();
                } );
            }
        });

        var finishLoading = function() {
            if (totalLoaded <= 0 && typeof callback == 'function') {
                callback();
            }
        }
    },

    addObject: function (object) {
        this.objects.forEach( function (object) {
            if (object.material != null && object.material.map != null && object.material.map.needsUpdate == false) {
                object.material.needsUpdate = true;
                object.material.map.needsUpdate = true;
            }
        });
        this.objects[object.id] = object;
        return true;
    },

    update: function() {

        TWEEN.update();
        this.time = Date.now();
        this.counter++;
    },

    deselectAll: function() {
        this.objects.forEach(function(object, index) {
            if (typeof object.deselect == 'function') {
                object.deselect();
            }
        });
        TowerDefense.selectedObject = {};
    },
}