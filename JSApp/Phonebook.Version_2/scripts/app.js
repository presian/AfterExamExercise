var app = app || {};

(function() {
    var baseUrl = 'https://api.parse.com/1/';
    var requester = app.requester.get();
    var data = app.dataManager.get(baseUrl, requester);
    var controller = app.controller.get(data);
    controller.attachEventHandlers();

    app.router = Sammy(function() {
        var selector = '#wrapper';

        this.get('#/', function() {
            $('#menu').hide();
            sessionStorage.clear();
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

        this.get('#/phonebook', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadPhonebook(selector);
            }
        })

        this.get('#/addphone', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadAddPhone(selector);
            }
        })

        this.get('#/editphone', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadEditPhone(selector);
            }
        })

        this.get('#/deletephone', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadDeletePhone(selector);
            }
        })

        this.get('#/editprofile', function() {
            if (!sessionStorage.token) {
                window.parent.location = '#/';
            } else {
                controller.loadEditProfile(selector);
            }
        })
    })

    app.router.run('#/')

}())
