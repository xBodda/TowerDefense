TowerDefense.Ui = { 

    initialize: function() {
        $('#game').addEventListener('click', this.click, false);
        window.addEventListener("resize", this.windowResized, false);
        document.addEventListener('keyup', this.keyup, false);
    },

    initializeControls: function(camera) {
        TowerDefense.controls = new THREE.OrbitControls( camera );
        TowerDefense.controls.minDistance = 30;
        TowerDefense.controls.maxDistance = 1000;
        TowerDefense.controls.noPan = false;
        TowerDefense.controls.minPolarAngle = 0;
        TowerDefense.controls.maxPolarAngle = 1.6; 
    },

    menu: function() {

        for (var i = 0; i < $('.status-menu').length; i++) {
            $('.status-menu')[i].style.display = 'block';
        }
        for (var i = 0; i < $('.status-in-game').length; i++) {
            $('.status-in-game')[i].style.display = 'none';
        }
        for (var i = 0; i < $('.status-menu-game').length; i++) {
            $('.status-menu-game')[i].style.display = 'none';
        }
        TowerDefense.reset();
    },

    playLevel: function() {

        TowerDefense.reset();

        for (var i = 0; i < $('.status-menu').length; i++) {
            $('.status-menu')[i].style.display = 'none';
        }

        for (var i = 0; i < $('.status-in-game').length; i++) {
            $('.status-in-game')[i].style.display = 'block';
        }

        for (var i = 0; i < $('.status-menu-game').length; i++) {
            $('.status-menu-game')[i].style.display = 'none';
        }

        this.level = new TowerDefense.Level1();
        this.level.start();

    },

    windowResized: function() 
    {
        if (TowerDefense.camera.updateProjectionMatrix != null) {
            TowerDefense.camera.aspect = window.innerWidth / window.innerHeight;
            TowerDefense.camera.updateProjectionMatrix();
            TowerDefense.renderer.setSize( window.innerWidth, window.innerHeight );
            TowerDefense.gameWidth = window.innerWidth;
            TowerDefense.gameHeight = window.innerHeight;
        }
    },

    click: function(event) {
        if (TowerDefense.camera != null) {
            var objects = [];
            TowerDefense.objects.forEach(function(object, index) {
                if (object.object != null) {
                    object.object.objectIndex = index;
                    objects.push(object.object);
                }
            });

            event.preventDefault();
            var vector = new THREE.Vector3(
              (event.pageX / TowerDefense.gameWidth) * 2 - 1,
              - (event.pageY / TowerDefense.gameHeight) * 2 + 1,
              0.5);
            TowerDefense.projector.unprojectVector(vector, TowerDefense.camera);
            var ray = new THREE.Raycaster(TowerDefense.camera.position, vector.sub(TowerDefense.camera.position).normalize());
            var intersects = ray.intersectObjects(objects, true);
            var objectSelected = false;
            if (intersects.length > 0) {
                for (var i = 0; i < intersects.length; i++) {
                    var currentObject = TowerDefense.objects[intersects[i].object.objectIndex];
                    if (currentObject != null && currentObject.selectable == true && typeof currentObject.select == 'function' && currentObject.selected == false) {
                        TowerDefense.deselectAll();
                        currentObject.select();
                        objectSelected = true;
                        break;
                    }
                }
            }
            if (objectSelected == false) {
                TowerDefense.Ui.hideBuildMenu();
            }
        }
    },

    showBuildMenu: function() 
    {
        if (TowerDefense.selectedObject.currentTower.id == null) {
            $('#build-menu').innerHTML = '';
            TowerDefense.availableTowers.forEach(function(tower, index) {
                var object = tower.object();
                var image = '<img src="assets/towers/' + object.icon +'" />';
                var currencyDiv = '<div class="overlay overlay-black bottom text-center resources">'+ object.stats.costs +'</div>';
                var link = '<a class="game-stat" onclick="TowerDefense.Ui.buildTower('+ index +');">'+ currencyDiv + image +'</a>';
                $('#build-menu').innerHTML += link;
            });
            $('#build-menu').className = $('#build-menu').className.replace("slide-up", '');
            $('#build-menu').className = $('#build-menu').className.replace("slide-down", '');
            $('#build-menu').className += ' slide-up';
        }
    },

    hideBuildMenu: function() {
        TowerDefense.deselectAll();
        $('#build-menu').className = $('#build-menu').className.replace("slide-up", '');
        $('#build-menu').className = $('#build-menu').className.replace("slide-down", '');
        $('#build-menu').className += ' slide-down';
    },

    buildTower: function (towerIndex) 
    {
        var tower = TowerDefense.availableTowers[towerIndex].object();
            tower.create();
            tower.spawn(TowerDefense.selectedObject);
            tower.add();
            TowerDefense.deselectAll();
            TowerDefense.Ui.hideBuildMenu();
    }
}