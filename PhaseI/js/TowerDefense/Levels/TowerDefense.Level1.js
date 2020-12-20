TowerDefense.Level1 = function () {

    TowerDefense.Level.call( this );

    this.meshes = [
        {
            'key': 'tower-01',
            'file': 'assets/towers/cube.obj'
        },
    ];
    this.textures = [
        {
            'key': 'tower-01',
            'file': 'assets/towers/tower-01.jpg'
        },
        {
            'key': 'level-01',
            'file': 'assets/levels/level-01.jpg'
        },
    ];

}

TowerDefense.Level1.prototype = Object.create( TowerDefense.Level.prototype );