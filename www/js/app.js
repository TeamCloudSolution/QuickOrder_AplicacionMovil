// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('mesas', {
    url: '/mesas',
    templateUrl: 'templates/mesas.html',
    controller: 'MesasCtrl'
  })
  .state('pedido', {
    url: '/pedido',
    templateUrl: 'templates/pedido.html',
    controller: 'PedidoCtrl'
  })
  .state('categorias', {
    url: '/categorias/:p_mesaId',
    templateUrl: 'templates/categorias.html',
    controller: 'CategoriasCtrl'
  })
  .state('productos', {
    url: '/productos/:p_mesaId/:p_categoriaId',
    templateUrl: 'templates/productos.html',
    controller: 'ProductosCtrl'
  })
  .state('productodetalle', {
    url: '/productodetalle/:p_categoriaId/:p_productoId',
    templateUrl: 'templates/producto_detalle.html',
    controller: 'ProductoDetalleCtrl'
  })
  .state('detallepedido', {
    url: '/detallepedido',
    templateUrl: 'templates/detalle_pedido.html',
    controller: 'DetallePedidoCtrl'
  })
  .state('promociones', {
    url: '/promociones',
    templateUrl: 'templates/promociones.html',
    controller: 'PromocionesCtrl'
  })

  $urlRouterProvider.otherwise('/mesas');

});

app.value('pedido',{
  mesaId: '',
  productos: []
});


app.controller('PedidoCtrl', function($scope, pedido){
  $scope.crearPedido = function(){
    pedido.mesaId = '';
    pedido.productos = [];
    console.log("mesaId:" + pedido.mesaId);
    console.log("productos:");
    console.log(pedido.productos);
    console.log("------------------------------------------");
  };
});


app.controller('MesasCtrl', function($scope, $http){
  $http({
    method: 'GET',
    url: 'http://127.0.0.1:8080/HeladeriaBambiRest/rs/servicios/mesas/'
  })
  .then(
    function successCallback(response) {
      console.log('edson1101')
      console.log("Mesas obtenidas correctamente");
      console.log(response.data);
      console.log(response.status);
      $scope.mesas = response.data;
      $scope.msjerror = 'correcto';
    },
    function errorCallback(response, status) {
      console.log("Fallo al obtener las mesas");
      $scope.mesas = [];
      console.log(response);
      console.log(response.status);
      $scope.msjerror = response.status;
    });
});


app.controller('CategoriasCtrl', function($scope, $http, $stateParams, pedido){
  console.log('---------- Interfaz Categorias');
  if($stateParams.p_mesaId){
    pedido.mesaId = $stateParams.p_mesaId;
  }
  console.log('mesaId: ' + pedido.mesaId);
  $http.get('http://127.0.0.1:8080/HeladeriaBambiRest/rs/servicios/categorias')
    .success(function(data) {
      console.log("Categorias obtenidas correctamente");
      console.log(data);
      $scope.categorias = data;
    })
    .error(function(dataerr) {
      console.log("Fallo al obtener las categorias");
      $scope.categorias = [];
    });
});


app.controller('ProductosCtrl', function($scope, $http, $stateParams, pedido){
  console.log('---------- Interfaz Productos');
  console.log($stateParams);
  if($stateParams.p_mesaId){
    pedido.mesaId = $stateParams.p_mesaId;
  }
  console.log('mesaId: ' + pedido.mesaId);
  $scope.categoriaId = $stateParams.p_categoriaId;
  $http.get('http://127.0.0.1:8080/HeladeriaBambiRest/rs/servicios/productoCategoria/' + $scope.categoriaId)
    .success(function(data) {
      console.log("Productos obtenidos correctamente");
      console.log('edson1139'),
      console.log(data);
      $scope.productos = data;
    })
    .error(function(dataerr) {
      console.log("Fallo al obtener los productos");
      $scope.productos = [];
    });
    $http.get('http://127.0.0.1:8080/HeladeriaBambiRest/rs/servicios/categorias')
      .success(function(data) {
        console.log("Categorias obtenidas correctamente");
        console.log(data);
        $scope.categorias = data;
      })
      .error(function(dataerr) {
        console.log("Fallo al obtener las categorias");
        $scope.categorias = [];
      });
});


app.controller('ProductoDetalleCtrl', function($scope, $http, $stateParams, pedido){
  console.log('---------- Interfaz Detalle Producto');
  $scope.categoriaId = $stateParams.p_categoriaId;
  $scope.productoId = $stateParams.p_productoId;
  $scope.cantidad = '';
  $http.get('http://127.0.0.1:8080/HeladeriaBambiRest/rs/servicios/productos/' + $scope.productoId)
    .success(function(data) {
      console.log("Productos obtenidos correctamente");
      $scope.producto = data;
    })
    .error(function(dataerr) {
      console.log("Fallo al obtener los productos");
      $scope.producto = [];
    });
  $scope.agregar = function(nombre, precio, cantidad){
    console.log("cantidad: " + cantidad);
    pedido.productos.push({'producto': $scope.productoId, 'cantidad': cantidad, 'precio': precio, 'nombre': nombre });
    console.log(pedido.productos);
  }
});


app.controller('DetallePedidoCtrl', function($scope, $http, $stateParams, pedido) {
  console.log('---------- Interfaz Detalle Pedido');
  console.log("mesaId: " + pedido.mesaId);
  $scope.mesa = pedido.mesaId;
  $scope.nit = '';
  $scope.razonSocial = '';

  var suma = 0;
  pedido.productos.forEach(function(producto){
    suma = suma + (producto.precio * producto.cantidad);
  });
  $scope.total = suma;
  $scope.productos = pedido.productos;

  $scope.confirmar = function(p_nit, p_razonSocial){
    console.log("confirmar pedido");
    console.log("mesaId: " + pedido.mesaId);
    console.log(JSON.stringify(pedido));

    var trama = "";
    pedido.productos.forEach(function(producto){
      trama = trama + producto.producto + "," + producto.cantidad + "-";
    });
    console.log("trama: " + trama);
    console.log('--- nit:' + p_nit);
    if(!p_nit){
      p_nit = 0;
    }
    console.log('--- razon social:' + p_razonSocial);
    if(!p_razonSocial){
      p_razonSocial = 'sn';
    }
    var url = "http://127.0.0.1:8080/HeladeriaBambiRest/rs/servicios/guardarPedido/" + pedido.mesaId + "/"+ p_nit +"/"+p_razonSocial+"/" + trama;
    console.log(url);
    $http.get(url)
      .success(function(data) {
        console.log("Mesas obtenidas correctamente");
      })
      .error(function(dataerr) {
        console.log("Fallo al obtener las mesas");
      });
  };

  $scope.cancelar = function(){
    console.log("cancelar pedido");
    pedido.mesaId = '';
    pedido.productos = [];
    console.log("mesaId: " + pedido.mesaId);
  };
}
);

app.controller('PromocionesCtrl', function($scope, $http){
  $scope.options = {
  loop: false,
  effect: 'fade',
  speed: 500,
}

$scope.$on("$ionicSlides.sliderInitialized", function(event, data){
  // data.slider is the instance of Swiper
  $scope.slider = data.slider;
});

$scope.$on("$ionicSlides.slideChangeStart", function(event, data){
  console.log('Slide change is beginning');
});

$scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
  // note: the indexes are 0-based
  $scope.activeIndex = data.slider.activeIndex;
  $scope.previousIndex = data.slider.previousIndex;
});
});
