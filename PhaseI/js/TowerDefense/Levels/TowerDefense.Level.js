TowerDefense.Level = function () {

    this.meshes = [];

    this.textures = [];

    this.sizes = {
        x: 10,
        y: 10
    }

    this.grid = [];
    this.grid[0] = [];
    this.grid[0][0] = {
        object: function() {
            return new TowerDefense.StartTile();
        },
        callback: function(tile) {
            TowerDefense.startTile = tile;
        }
    };
    this.grid[10] = [];
    this.grid[10][10] = {
        object: function() {
            return new TowerDefense.EndTile();
        },
        callback: function(tile) {
            TowerDefense.endTile = tile;
        }
    };
}

TowerDefense.Level.prototype.load = function(callback) {
    TowerDefense.meshObjects = this.meshes;
    TowerDefense.meshTextures = this.textures;
    TowerDefense.loadObjects(callback);
}

TowerDefense.Level.prototype.start = function () 
{
    var self = this;
    this.load(function() {
        self.createScene();
        self.createGrid();
        self.createDecoration();
        $('#game').appendChild( TowerDefense.renderer.domElement );
        handleWebGlErrors(
          TowerDefense.renderer.domElement,
          function (event) {
              event.preventDefault();
              cancelAnimationFrame(gameRender);
              console.log('WebGL context lost.', event);
          }
        );
        render();
        TowerDefense.Ui.initializeControls(TowerDefense.camera);
        TowerDefense.currentLevel = self;
    });
}

TowerDefense.Level.prototype.createScene = function () 
{
    TowerDefense.scene = new THREE.Scene();
    TowerDefense.camera = new THREE.PerspectiveCamera( 40, TowerDefense.gameWidth / TowerDefense.gameHeight, 0.1, 1000 );
    TowerDefense.camera.position.x = 60;
    TowerDefense.camera.position.y = -110;
    TowerDefense.camera.position.z = 80;
    TowerDefense.camera.up = new THREE.Vector3(0,0,1);
    TowerDefense.camera.lookAt(new THREE.Vector3(0,0,0));
    TowerDefense.renderer = new THREE.WebGLRenderer();
    TowerDefense.renderer.setSize( TowerDefense.gameWidth, TowerDefense.gameHeight );

    TowerDefense.renderer.shadowCameraNear = 3;
    TowerDefense.renderer.shadowCameraFar = TowerDefense.camera.far;
    TowerDefense.renderer.shadowCameraFov = 50;

    TowerDefense.projector = new THREE.Projector();
    cancelAnimationFrame(gameRender);
}

TowerDefense.Level.prototype.createGrid = function() {

    var x = 0;
    var y = 0;
    var tile = {};
    for (var i = 0; i <= this.sizes.x; i++ ) {

        x = i;
        if (this.grid[x] == null) {
            this.grid[x] = [];
        }
        TowerDefense.grid[x] = [];
        TowerDefense.gridPath[x] = [];
        for (var j = 0; j <= this.sizes.y; j++) {

            y = j;
            if (this.grid[x][y] == null) {
                this.grid[x][y] = [];
            }
            if (typeof this.grid[x][y].object == 'function') {
                tile = this.grid[x][y].object();
                if (typeof this.grid[x][y].callback == 'function') {
                    this.grid[x][y].callback(tile);
                }
            }
            else {
                tile = new TowerDefense.BasicTile();
            }
            tile.gridPosition = { x: x, y: y };
            TowerDefense.grid[x][y] = tile;
            TowerDefense.gridPath[x][y] = tile.open;
            tile.create();
            tile.add();
            var positionX = -(this.sizes.x * tile.squareSize / 2) + (i * Math.round(tile.squareSize));
            var positionY = -(this.sizes.y * tile.squareSize / 2) + (j * Math.round(tile.squareSize));
            tile.object.position.x = positionX;
            tile.object.position.y = positionY;
            TowerDefense.scene.add(tile.object);
        }
    }
}

TowerDefense.Level.prototype.createDecoration = function() {

    var decoTile = new TowerDefense.DecoTile();
    decoTile.create();
    decoTile.object.position.z = -.6;
    decoTile.add();
    TowerDefense.scene.add(decoTile.object);

    var hemiLight = new THREE.HemisphereLight( 0xf3fdff, 0xf7fff3, 0.6);
    hemiLight.position.set( 0, 0, 50 );
    TowerDefense.scene.add( hemiLight );

    var dirLight = new THREE.DirectionalLight( 0xffffff,.7 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1.1,1, 1.4 );
    dirLight.position.multiplyScalar( 60 );

    TowerDefense.scene.add( dirLight );
}