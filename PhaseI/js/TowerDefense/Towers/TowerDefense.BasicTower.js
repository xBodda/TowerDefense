TowerDefense.BasicTower = function () {

    TowerDefense.Tower.call( this );

    this.meshObject = 'tower-01';
    this.meshTexture = 'tower-01';
    this.icon = 'tower-01.png';
    this.stats = {
        costs: 'Free',
    }
    this.material = new THREE.MeshLambertMaterial( { color: 0xcccccc } );
}

TowerDefense.BasicTower.prototype = Object.create( TowerDefense.Tower.prototype );

TowerDefense.BasicTower.prototype.create = function () 
{
    TowerDefense.Tower.prototype.create.call(this);
    
    this.object.scale.x /= 2;
    this.object.scale.y /= 2;
    this.object.scale.z /= 2;

    this.object.position.z += 3;
    return this.object;
}