var app = app || {};

(function() {
    var url = 'https://api.parse.com/1/';
    var selector = '#main';
    var requester = app.requester.get();
    var data = app.data.get(url, requester);
    var controller = app.controller.get(data);
    controller.attachEventListeners(selector);

    app.router = Sammy(function() {
        this.get('#/', function() {
            controller.loadWelcome(selector);
        })

        this.get('#/login', function() {
            controller.loadLogin(selector);
        })

        this.get('#/registration', function() {
            controller.loadRegistration(selector);
        })

        this.get('#/home', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadHome(selector);
            }
        })

        this.get('#/products', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadProducts(selector);
            }
        })

        this.get('#/filteredproducts', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadFilteredProducts(selector);
            }
        })

        this.get('#/addproduct', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadAddProduct(selector);
            }
        })

        this.get('#/editproduct', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadEditProduct(selector);
            }
        })

        this.get('#/deleteproduct', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadDeleteProduct(selector);
            }
        })
    })

    app.router.run('#/');
}())
