var app = angular.module('myRestaurant', ['ngResource','ngRoute','myRestaurant.filters',
  'myRestaurant.services',
  'myRestaurant.directives',
  'myRestaurant.controllers']);

// Declare app level module which depends on filters, and services
app.config(function($routeProvider) {
  $routeProvider//.when('/view1/', {templateUrl: 'public/partials/partial1.html', controller: 'MyCtrlSection'})
  .when('/view1/:categoria', {templateUrl: 'public/partials/partial1.html', controller: 'MyCtrlCategory'})
  .when('/view2/:id', {templateUrl: 'public/partials/partial2.html', controller: 'MyCtrlPlatillo'})
  .when('/view3', {templateUrl: 'public/partials/partial3.html', controller: 'MyCar'})
  .otherwise({redirectTo: '/view1/Platillos'});
});

app.factory('cafeteriaFactory',function($rootScope, $http){
	
	var obj = {};

	obj.alimentos = [];
	obj.alimentostmp = [];
	obj.pedido = [];
	obj.entradas = [];
	obj.usuario = {};
	obj.total = 0;
	obj.alimentotmp = [];

	obj.getAlimentos = function(){
		obj.alimentos = [];
		return $http({
            "method": "get",
            "url": '/alimentos'
        });
	};

	obj.getCategoria = function(categoria){
		obj.alimentostmp = [];
		obj.alimentos.forEach(function(alimento){
			if(alimento.categoria == categoria){
				obj.alimentostmp.push(alimento);
			}
		});
		return obj.alimentostmp;
	};

	obj.getAlimento = function(id){
		obj.alimentotmp = [];
		this.alimentos.forEach(function(platillo){
			if(platillo.id == id){
				obj.alimentotmp.push(platillo);
			}
		});
		return obj.alimentotmp;
	};

	obj.login = function(correo, password){
		return $http({
            "method": "get",
            "url": '/login?correo=' + correo + '&contrasena=' + password
        });
	}

	obj.getPedido = function(idUsuario){
		return $http({
            "method": "get",
            "url": '/pedido?idUsuario=' + idUsuario
        });
	}

	obj.changePedido = function(){
		return $http({
            "method": "get",
            "url": '/pedido?idUsuario=' + obj.usuario.id
        });
	}

	obj.delEntrada = function(alimento) {

  		 for (var i=0 ; i<=obj.entradas.length - 1; i++) {

    		if(obj.entradas[i].id == alimento.id)
    		{	
    			$http.get("/delPedido?entradaId=" + obj.entradas[i].id);
    			obj.entradas.splice(i, 1);
    			totalizar();
    			obj.broadcastItem('newTotal');

    			break;    			
    		}      		
    	}
    }

    obj.obtenerEntradas = function(){
    	totalizar();
    	console.log("se llamo a obtener Entradas");
    	return obj.entradas;
    }

	obj.getEntradas = function(idPedido){
		return $http({
            "method": "get",
            "url": '/entradas?idPedido=' + idPedido
        });
	}

	obj.pagar = function(){
		//console.log("/pagar?pedidoId=" + obj.pedido.id + "&usuarioId=" + obj.usuario.id);
		$http.get("/pagar?pedidoId=" + obj.pedido.id + "&usuarioId=" + obj.usuario.id);
		obj.entradas = [];

	}

	obj.obtenerTotal = function(){
		totalizar();
		return obj.total;
	}

	obj.actualizarPedido = function(alimento) {

		for (var i=0 ; i<=obj.entradas.length - 1; i++) {

    		if(obj.entradas[i]["alimento"].id == alimento.alimento.id)
    		{
    			obj.entradas[i].cantidad = alimento.cantidad;

    			console.log(alimento.cantidad)
    			$http.get("/addPedido?cantidad=" + obj.entradas[i].cantidad + "&pedidoId=" + obj.pedido.id + "&alimentoId=" + obj.entradas[i]["alimento"].id + "&entradaId=" + obj.entradas[i]["id"]);    			
    			break;
    		}    			    		
     	} 

		 //recaulcular el total
		 totalizar();
		 this.broadcastItem('newTotal');
    };

	obj.addToPedido = function(alimento){
		var esta = false;

  		 for (var i=0 ; i<=obj.entradas.length - 1; i++) {

    		if(obj.entradas[i]["alimento"].id == alimento.id)
    		{
    			obj.entradas[i].cantidad = parseInt(obj.entradas[i].cantidad) + 1;

    			$http.get("/addPedido?cantidad=" + obj.entradas[i].cantidad + "&pedidoId=" + obj.pedido.id + "&alimentoId=" + obj.entradas[i]["alimento"].id + "&entradaId=" + obj.entradas[i]["id"]);
    			//console.log("/addPedido?cantidad=" + obj.entradas[i].cantidad + "&pedidoId=" + obj.pedido.id + "&alimentoId=" + obj.entradas[i]["alimento"].id + "&entradaId=" + obj.entradas[i]["id"]);
    			esta = !esta;
    			totalizar();
    			this.broadcastItem('newTotal');		 

		 		this.broadcastItem('newItem');
    			//break;    			
    		}      		
     	}

  		 //buscarlo y si esta actualizarlo si no agregarlo
  		if(!esta)
  		{	

  		 	$http.get("/addPedido?cantidad=" + 1 + "&pedidoId=" + obj.pedido.id + "&alimentoId=" + alimento.id + "&entradaId=").success(function(data){
  		 		tmpProduct = data;
  		 		obj.entradas.push(tmpProduct);
  		 		totalizar();
    			obj.broadcastItem('newTotal');		 

		 		obj.broadcastItem('newItem');
  		 	});
		}
  		 
		 
		
		 //recaulcular el total
		 
		 console.log("se llamo a add to pedido");
		 
    };

    obj.broadcastItem = function(event) {
        $rootScope.$broadcast(event);
    };


    var totalizar = function(){

		obj.total = 0;
		var impo = 0;
		
    	angular.forEach(obj.entradas, function(r) {
      		
			if( r.cantidad == '')
				impo = 0; 
      		else
				impo = parseInt(r.alimento.price) * parseInt(r.cantidad);
      		
			//r.importe = impo;

			obj.total+= impo;
    	});
    	console.log("se llamo a totalizar, nuevo total: " + obj.total);
	};

	return obj;
});


