THREE.OBJLoader = function ( manager ) 
{
    this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
};

THREE.OBJLoader.prototype = {

    constructor: THREE.OBJLoader,

    load: function ( url, onLoad, onProgress, onError )
    {
        var scope = this;

        var loader = new THREE.XHRLoader( scope.manager );
        loader.setCrossOrigin( this.crossOrigin );
        loader.load( url, function ( text ) 
        {
            onLoad( scope.parse( text ) );
        } );
    },

    parse: function ( text )
    {

        function vector( x, y, z ) 
        {
            return new THREE.Vector3( parseFloat( x ), parseFloat( y ), parseFloat( z ) );
        }

        function uv( u, v ) 
        {
            return new THREE.Vector2( parseFloat( u ), parseFloat( v ) );
        }

        function face3( a, b, c, normals ) 
        {
            return new THREE.Face3( a, b, c, normals );
        }

        var object = new THREE.Object3D();
        var geometry, material, mesh;

        function parseVertexIndex( index ) 
        {
            index = parseInt( index );

            return index >= 0 ? index - 1 : index + vertices.length;
        }

        function parseNormalIndex( index ) 
        {
            index = parseInt( index );

            return index >= 0 ? index - 1 : index + normals.length;
        }

        function parseUVIndex( index ) 
        {
            index = parseInt( index );

            return index >= 0 ? index - 1 : index + uvs.length;
        }

        function add_face( a, b, c, normals_inds ) 
        {
            if ( normals_inds === undefined ) 
            {
                geometry.faces.push( face3(
                  vertices[ parseVertexIndex( a ) ] - 1,
                  vertices[ parseVertexIndex( b ) ] - 1,
                  vertices[ parseVertexIndex( c ) ] - 1
                ) );
            }
            else 
            {
                geometry.faces.push( face3(
                  vertices[ parseVertexIndex( a ) ] - 1,
                  vertices[ parseVertexIndex( b ) ] - 1,
                  vertices[ parseVertexIndex( c ) ] - 1,
                  [
                      normals[ parseNormalIndex( normals_inds[ 0 ] ) ].clone(),
                      normals[ parseNormalIndex( normals_inds[ 1 ] ) ].clone(),
                      normals[ parseNormalIndex( normals_inds[ 2 ] ) ].clone()
                  ]
                ) );
            }
        }

        function add_uvs( a, b, c ) 
        {
            geometry.faceVertexUvs[ 0 ].push( [
                uvs[ parseUVIndex( a ) ].clone(),
                uvs[ parseUVIndex( b ) ].clone(),
                uvs[ parseUVIndex( c ) ].clone()
            ] );
        }

        function handle_face_line(faces, uvs, normals_inds) {

            if ( faces[ 3 ] === undefined ) 
            {
                add_face( faces[ 0 ], faces[ 1 ], faces[ 2 ], normals_inds );

                if ( uvs !== undefined && uvs.length > 0 ) 
                {
                    add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 2 ] );
                }
            } 
            else 
            {
                if ( normals_inds !== undefined && normals_inds.length > 0 ) 
                {
                    add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ], [ normals_inds[ 0 ], normals_inds[ 1 ], normals_inds[ 3 ] ] );
                    add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ], [ normals_inds[ 1 ], normals_inds[ 2 ], normals_inds[ 3 ] ] );
                } 
                else 
                {
                    add_face( faces[ 0 ], faces[ 1 ], faces[ 3 ] );
                    add_face( faces[ 1 ], faces[ 2 ], faces[ 3 ] );
                }

                if ( uvs !== undefined && uvs.length > 0 ) 
                {
                    add_uvs( uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] );
                    add_uvs( uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] );
                }
            }
        }

        if ( /^o /gm.test( text ) === false ) 
        {
            geometry = new THREE.Geometry();
            material = new THREE.MeshLambertMaterial();
            mesh = new THREE.Mesh( geometry, material );
            object.add( mesh );
        }

        var vertices = [];
        var normals = [];
        var uvs = [];

        var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( +[\d|\.|\+|\-|e]+)/;

        var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

        var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

        var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

        var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/

        text = text.replace( /\\\r\n/g, '' );

        var lines = text.split( '\n' );

        for ( var i = 0; i < lines.length; i ++ ) 
        {
            var line = lines[ i ];
            line = line.trim();

            var result;

            if ( line.length === 0 || line.charAt( 0 ) === '#' ) 
            {
                continue;
            } 
            else if ( ( result = vertex_pattern.exec( line ) ) !== null ) 
            {
                vertices.push(
                  geometry.vertices.push(
                    vector(
                      result[ 1 ], result[ 2 ], result[ 3 ]
                    )
                  )
                );
            } 
            else if ( ( result = normal_pattern.exec( line ) ) !== null ) 
            {
                normals.push(
                  vector(
                    result[ 1 ], result[ 2 ], result[ 3 ]
                  )
                );
            } 
            else if ( ( result = uv_pattern.exec( line ) ) !== null ) 
            {
                uvs.push(
                  uv(
                    result[ 1 ], result[ 2 ]
                  )
                );
            } 
            else if ( ( result = face_pattern1.exec( line ) ) !== null ) 
            {
                handle_face_line(
                  [ result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ] ]
                );
            } 
            else if ( ( result = face_pattern2.exec( line ) ) !== null ) 
            {
                handle_face_line(
                  [ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
                  [ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //uv
                );
            } 
            else if ( ( result = face_pattern3.exec( line ) ) !== null ) 
            {
                handle_face_line(
                  [ result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ] ], //faces
                  [ result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ] ], //uv
                  [ result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ] ] //normal
                );
            } 
            else if ( ( result = face_pattern4.exec( line ) ) !== null ) 
            {
                handle_face_line(
                  [ result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ] ], //faces
                  [ ], //uv
                  [ result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ] ] //normal
                );
            }
            else if ( /^o /.test( line ) ) 
            {
                geometry = new THREE.Geometry();
                material = new THREE.MeshLambertMaterial();
                mesh = new THREE.Mesh( geometry, material );
                mesh.name = line.substring( 2 ).trim();
                object.add( mesh );
            } 
            else if ( /^usemtl /.test( line ) ) 
            {
                material.name = line.substring( 7 ).trim();
            }

        }

        var children = object.children;

        for ( var i = 0, l = children.length; i < l; i ++ ) 
        {
            var geometry = children[ i ].geometry;
            geometry.computeFaceNormals();
            geometry.computeBoundingSphere();
        }
        return object;
    }
};
