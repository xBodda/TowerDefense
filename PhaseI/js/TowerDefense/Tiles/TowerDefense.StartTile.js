TowerDefense.StartTile = function () 
{
    TowerDefense.Tile.call( this );
    this.material = new THREE.MeshBasicMaterial( { transparent: true, opacity:.8, color: 0x1eff00 } );
}

TowerDefense.StartTile.prototype = Object.create( TowerDefense.Tile.prototype );

TowerDefense.StartTile.prototype.select = function() 
{
    return false;
}

TowerDefense.StartTile.prototype.deselect = function() 
{
    return false;
}