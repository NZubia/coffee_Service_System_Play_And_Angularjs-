'use strict';

/* Controllers */
function MyCtrlPlatillo($scope, $routeParams, cafeteriaFactory){
	$scope.itemId = $routeParams.id;
	$scope.alimento =  cafeteriaFactory.getAlimento($scope.itemId);
	$scope.total = cafeteriaFactory.total;

	$scope.addToPedido = function(alimento){
		cafeteriaFactory.addToPedido(alimento);
	};

	$scope.$on('newTotal', function() {
        $scope.total = cafeteriaFactory.obtenerTotal();

  	}); 


	$scope.$on('entradas', function() {
  		console.log("se llamo a entradas");
        $scope.entradas = cafeteriaFactory.obtenerEntradas();
        console.log($scope.entradas);
  	});

}

function MyCar($scope, cafeteriaFactory){
	$scope.entradas = cafeteriaFactory.obtenerEntradas();

	$scope.total = cafeteriaFactory.total;
	/*
	for (var i in $scope.entradas){
		$scope.total+=$scope.entradas[i]["cantidad"]*$scope.entradas[i]["alimento"]["price"];
	}*/

	$scope.delEntrada = function (alimento){
		cafeteriaFactory.delEntrada(alimento);	
	};

	$scope.$on('newTotal', function() {
        $scope.total = cafeteriaFactory.total;
  	});


  	$scope.addToPedido = function(alimento){
		cafeteriaFactory.addToPedido(alimento);
	};

	$scope.actualizarPedido = function(alimento){
		cafeteriaFactory.actualizarPedido(alimento);
	};

	$scope.pagar = function(){
		cafeteriaFactory.pagar();

		var myDataPromise = cafeteriaFactory.changePedido();
        
        myDataPromise.then(function(result) {
            cafeteriaFactory.pedido = result.data;
            console.log(cafeteriaFactory.pedido);
			$scope.pedido =  cafeteriaFactory.pedido;
        });
	};
}

function MyCtrlSection($scope, cafeteriaFactory){
	if(cafeteriaFactory.alimentos[0]){
			$scope.alimentos = cafeteriaFactory.alimentos;
	}
	else{
		var myDataPromise = cafeteriaFactory.getAlimentos();
        
        myDataPromise.then(function(result) {
            cafeteriaFactory.alimentos = result.data;
            $scope.alimentos =  cafeteriaFactory.alimentos;
        });
	}
}

function MyCtrlCategory($scope, $routeParams, cafeteriaFactory){
	$scope.total = cafeteriaFactory.total;
	console.log("Total en categoria" + $scope.total);

	//$scope.entradas = cafeteriaFactory.getEntradas();

	$scope.addToPedido = function(alimento){
		cafeteriaFactory.addToPedido(alimento);
	};
	//cafeteriaFactory.totalizar();
	$scope.$on('newTotal', function() {
        $scope.total = cafeteriaFactory.obtenerTotal();

  	}); 


	$scope.$on('entradas', function() {
  		console.log("se llamo a entradas");
        $scope.entradas = cafeteriaFactory.obtenerEntradas();
        console.log($scope.entradas);
  	});

	$scope.categoria = $routeParams.categoria;
	if($scope.categoria == "Platillos"){
		console.log("Se llamo a controlador categoria");
		if(cafeteriaFactory.alimentos[0]){
			$scope.alimentos = cafeteriaFactory.alimentos;
		}
		else{
			var myDataPromise = cafeteriaFactory.getAlimentos();
	        
	        myDataPromise.then(function(result) {
	            cafeteriaFactory.alimentos = result.data;
	            $scope.alimentos =  cafeteriaFactory.alimentos;
	        });
	    }
	}
	else
    	$scope.alimentos =  cafeteriaFactory.getCategoria($scope.categoria);
    	
    //$scope.entradas = cafeteriaFactory.obtenerEntradas();
}

function index($scope, cafeteriaFactory){
	
	$scope.login = function(usuario){

        if(usuario.correo){

        	var myDataPromise = cafeteriaFactory.login(usuario.correo, usuario.pass);
        
		    myDataPromise.then(function(result) {
		    	if(result.data){
		        	cafeteriaFactory.usuario = result.data;
		        	$scope.usuario =  cafeteriaFactory.usuario;
		        	$scope.usuario.isLogged = true;

		        	var myDataPromise2 = cafeteriaFactory.getPedido($scope.usuario.id);

		        	myDataPromise2.then(function(result) {
				    	if(result.data){
				        	cafeteriaFactory.pedido = result.data;
				        	$scope.pedido =  cafeteriaFactory.pedido;

				        	var myDataPromise3 = cafeteriaFactory.getEntradas($scope.pedido.id);

				        	myDataPromise3.then(function(result) {
						    	if(result.data){
						        	cafeteriaFactory.entradas = result.data;
						        	$scope.entradas =  cafeteriaFactory.obtenerEntradas();
						        	$scope.total = cafeteriaFactory.obtenerTotal();
						        	cafeteriaFactory.broadcastItem('newTotal');
						        	cafeteriaFactory.broadcastItem('entradas');
						        }
						        else{
						        	
						        }
						    });//End of third promise
				        }//End of if
				        else{
				        	
				        }//End of else
				    });//End of secodn promise
		        }//End if
		        else{
		        	console.log("No se encontro usuario");
		        }//End else
		    });//End of first promise
        }//End of if
    }//End of login
}//End of Index

angular.module('myRestaurant.controllers', [])
  .controller('MyCar', MyCar)
  .controller('index', index)
  .controller('MyCtrl2', ['$scope', function($scope) {

  }]);
