TowerDefense.Element = function () {

    this.id = TowerDefense.elementCount++;

    this.type = '';

    this.material = {};
    this.geometry = {};
    this.meshTexture = ''; 
    this.meshObject = '';

    this.materialTransparent = false;

    this.object = {};

    this.selected = false;

    this.selectable = false;
}

TowerDefense.Element.prototype = {

    create: function() 
    {
        if (this.meshObject != null && this.meshObject != '') {
            var refObject = TowerDefense.meshObjects[this.meshObject];
            this.geometry = refObject.object.geometry;
        }

        if (this.meshTexture != null && this.meshTexture != '') {
            var texture = TowerDefense.meshTextures[this.meshTexture];
            texture = texture.texture;
            var spec = null;
            if (this.meshTextureSpec != null) {
                spec = TowerDefense.meshTextures[this.meshTextureSpec];
                spec = spec.texture;
            }
            var normal = null;
            if (this.meshTextureNormal != null) {
                normal = TowerDefense.meshTextures[this.meshTextureNormal];
                normal = normal.texture;
            }
        
            this.material = new THREE.MeshLambertMaterial(
            {
                map: texture,
                transparent: this.materialTransparent
            }
            );
        }
        this.object = new THREE.Mesh( this.geometry, this.material );
        return this.object;
    },

    add: function () {
        return TowerDefense.addObject(this);
    },
}

TowerDefense.elementCount = 0;