TowerDefense.Tower = function () 
{
    TowerDefense.Element.call( this );

    this.material = new THREE.MeshLambertMaterial( { color: 0x368218 } );
    this.geometry = new THREE.BoxGeometry( .85, .85, 2 );
}

TowerDefense.Tower.prototype = Object.create( TowerDefense.Element.prototype );

TowerDefense.Tower.prototype.constructor = TowerDefense.Tower;

TowerDefense.Tower.prototype.create = function () {
    TowerDefense.Element.prototype.create.call(this);
}

TowerDefense.Tower.prototype.spawn = function(tileObject) {

    if (tileObject == null) {
        console.log('Cannot build tower on the selected tile.');
        return false;
    }
    
    if (tileObject.currentTower.id != null) {
        console.log('Already tower on this tile.');
        return false;
    }

    tileObject.object.add(this.object);
    tileObject.currentTower = this;
    return true;
}