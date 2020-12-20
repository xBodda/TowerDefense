TowerDefense.Tower = function () {

    TowerDefense.Element.call( this );

    this.name = ''; // Name of the tower
    this.description = ''; // Description of the tower. May contain HTML
    this.stats = {
        costs: 1,
        speed: 4000, // Interval in ms. @todo Might wanna do this in fps 'time'
        range: 20
    }
    this.icon = 'default.png'; // Tower icon

    this.material = new THREE.MeshLambertMaterial( { color: 0x368218 } );
    this.geometry = new THREE.BoxGeometry( .85, .85, 2 );
    /**
     * Whether an enemy can or cannot walk through it.
     * @type {boolean}
     */
    this.collisionable = true;

    /**
     * Index of the TowerDefense.objects that this tower is shooting at.
     * @type {number}
     */
    this.shootingTargetIndex = -1;
    this.lastShot = Date.now();
    this.bullet = function () { return new TowerDefense.Bullet(); };
    this.bulletOffset = { x: 0, y: 0, z: 0 };

}
// @todo create prototype
TowerDefense.Tower.prototype = Object.create( TowerDefense.Element.prototype );

TowerDefense.Tower.prototype.constructor = TowerDefense.Tower;

TowerDefense.Tower.prototype.create = function () {

    TowerDefense.Element.prototype.create.call(this);

}

/**
 * Spawns the tower to the selected tileObject
 * enemies. Traps for example will not close the current grid position.
 * @param tileObject
 * @returns boolean
 */
TowerDefense.Tower.prototype.spawn = function(tileObject) {

    if (tileObject == null) {
        console.log('Cannot build tower on the selected tile.');
        return false;
    }
    if (tileObject.currentTower.id != null) {
        console.log('Already tower on this tile.');
        return false;
    }

    if (this.collisionable == true) {
        TowerDefense.grid[tileObject.gridPosition.x][tileObject.gridPosition.y].open = false;
        TowerDefense.gridPath[tileObject.gridPosition.x][tileObject.gridPosition.y] = false;
    }
    tileObject.object.add(this.object);
    tileObject.currentTower = this;
    return true;

}