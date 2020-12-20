TowerDefense.EndTile = function () 
{
    TowerDefense.Tile.call( this );
    this.material = new THREE.MeshBasicMaterial( { transparent: true, opacity:.8, color: 0xff0000 } );
}

TowerDefense.EndTile.prototype = Object.create( TowerDefense.Tile.prototype );

TowerDefense.EndTile.prototype.select = function() 
{
    return false;
}

TowerDefense.EndTile.prototype.deselect = function() 
{
    return false;
}