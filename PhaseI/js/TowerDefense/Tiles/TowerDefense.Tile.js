TowerDefense.Tile = function () {

    TowerDefense.Element.call( this );
    this.material = new THREE.MeshPhongMaterial( { color: 0xffffff, transparent: true, opacity:0 } );
    this.squareSize = 9;
    this.geometry = new THREE.PlaneGeometry( this.squareSize, this.squareSize);
    this.selectable = true;
    this.currentTower = {};
}

TowerDefense.Tile.prototype = Object.create( TowerDefense.Element.prototype );

TowerDefense.Tile.prototype.constructor = TowerDefense.Tile;

TowerDefense.Tile.prototype.select = function() {
    this.selected = true;
    TowerDefense.selectedObject = this;
    TowerDefense.Ui.showBuildMenu();
    this.object.material.opacity = .2;
};

TowerDefense.Tile.prototype.deselect = function() {
    this.selected = false;
    this.object.material.opacity = 0;
};