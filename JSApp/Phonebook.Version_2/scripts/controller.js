var app = app || {};

app.controller = (function() {
    function Controller(data) {
        this._data = data;
    }

    Controller.prototype.loadWelcome = function(selector) {
        $(selector).load('./templates/welcome.html');
        $('#header span').text(' - Welcome');
    };

    Controller.prototype.loadLogin = function(selector) {
        $(selector).load('./templates/login.html');
        $('#header span').text(' - Login');
    };

    Controller.prototype.loadRegistration = function(selector) {
        $(selector).load('./templates/registration.html');
        $('#header span').text(' - Registration');
    };

    Controller.prototype.loadHome = function(selector) {
        var username = sessionStorage.getItem('username');
        var fullName = sessionStorage.getItem('fullName');
        var userData = {
            'username': username,
            'fullName': fullName
        }
        $.get('./templates/home.html', function(template) {
            var output = Mustache.render(template, userData);
            $(selector).html(output);
        })
        $('#menu').show();
        $('#header span').text(' - Home');
    };

    Controller.prototype.loadPhonebook = function(selector) {
        this._data._phone.getAll()
            .then(function(data) {
                $.get('./templates/phonebook.html', function(template) {
                    var output = Mustache.render(template, data);
                    $(selector).html(output);
                })
                $('#header span').text(' - List');
                return data;
            }, function(error) {
                errorMesage('Loading phonebook failed!')
            })
    };

    Controller.prototype.loadAddPhone = function(selector) {
        $(selector).load('./templates/addphone.html');
        $('#header span').text(' - Add Phone');
    };

    Controller.prototype.loadEditPhone = function(selector) {
        var name = sessionStorage.getItem('personName');
        var number = sessionStorage.getItem('phoneNumber');
        var phoneId = sessionStorage.getItem('phoneId');

        var phoneData = {
            'name': name,
            'number': number,
            'phoneId': phoneId
        }

        $.get('./templates/editphone.html', function(template) {
            var output = Mustache.render(template, phoneData);
            $(selector).html(output);
        })

        $('#header span').text(' - Edit Phone');
    };

    Controller.prototype.loadDeletePhone = function(selector) {
        var phoneData = {
            'name': sessionStorage.getItem('personName'),
            'number': sessionStorage.getItem('phoneNumber')
        }

        $.get('./templates/deletephone.html', function(template) {
            var output = Mustache.render(template, phoneData);
            $(selector).html(output);
        })

        $('#header span').text(' - Delete Phone');
    };

    Controller.prototype.loadEditProfile = function(selector) {
        var userData = {
            'username': sessionStorage.getItem('username'),
            'password': sessionStorage.getItem('password'),
            'fullName': sessionStorage.getItem('fullName')
        }
        $.get('./templates/edituser.html', function(template) {
            var output = Mustache.render(template, userData);
            $(selector).html(output);
        })

        $('#header span').text(' - Edit Profile');
    };

    Controller.prototype.attachEventHandlers = function() {
        var selector = '#wrapper';
        clickedRegistrationButton.call(this, selector);
        clickedLoginButton.call(this, selector);
        clickedAddPhoneButton.call(this, selector);
        clickEditPhoneLink.call(this, selector);
        clickedEditPhoneButton.call(this, selector);
        clickDeletePhoneLink.call(this, selector);
        clickDeletePhoneButton.call(this, selector);
        clickedEditProfileButton.call(this, selector);
        clickedLogout.call(this, '#menu');
    };

    var clickedRegistrationButton = function(selector) {
        var _this = this;

        $(selector).on('click', '#reg-button', function(event) {
            event.preventDefault();
            var username = $('#username').val();
            var password = $('#password').val();
            var fullName = $('#fullName').val();
            _this._data._user.registration(username, password, fullName)
                .then(function(data) {
                    successMesage('Registration is done!')
                    window.parent.location = '#/home';
                    return data;
                }, function(error) {
                    errorMesage('Registration faild!')
                })
            event.stopPropagation()
        });
    }

    var clickedLoginButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#log-button', function(event) {
            event.preventDefault();
            var username = $('#username').val();
            var password = $('#password').val();
            _this._data._user.login(username, password)
                .then(function(data) {
                    successMesage('Login is done!')
                    window.parent.location = '#/home';
                    return data;
                }, function(error) {
                    errorMesage('Login failed!');
                })
            event.stopPropagation()
        });
    }

    var clickedAddPhoneButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#add-button', function(event) {
            event.preventDefault();
            var personName = $('#personName').val();
            var phoneNumber = $('#phoneNumber').val();
            _this._data._phone.addPhone(personName, phoneNumber)
                .then(function(data) {
                    successMesage('Adding is done!')
                    window.parent.location = '#/phonebook';
                    return data;
                }, function(error) {
                    errorMesage('Adding failed!')
                })
            event.stopPropagation()
        });
    }

    var clickEditPhoneLink = function(selector) {
        var _this = this;
        $(selector).on('click', '#edit-link', function(event) {
            event.preventDefault();
            getTargetPhoneData(event);
            window.parent.location = '#/editphone';
            event.stopPropagation()
        });
    }

    var clickedEditPhoneButton = function(selector) {
        _this = this;
        $(selector).on('click', '#edit-phone-button', function(event) {
            event.preventDefault();
            var number = $('#phoneNumber').val();
            var name = $('#personName').val();
            var phoneId = $(event.target).parents('div').data('id');
            _this._data._phone.editPhone(name, number, phoneId)
                .then(function(data) {
                    successMesage('Editing is done!')
                    window.parent.location = '#/phonebook';
                    return data;
                }, function(error) {
                    errorMesage('Editing failed!')
                })
            event.stopPropagation()
        });
    }

    var clickDeletePhoneLink = function(selector) {
        var _this = this;
        $(selector).on('click', '#del-link', function(event) {
            event.preventDefault();
            getTargetPhoneData(event);
            window.parent.location = '#/deletephone';
            event.stopPropagation()
        });
    }

    var clickDeletePhoneButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#del-button', function(event) {
            event.preventDefault();
            _this._data._phone.deletePhone(sessionStorage.getItem('phoneId'))
                .then(function(data) {
                    successMesage('Deleting is done!')
                    window.parent.location = '#/phonebook';
                    return data;
                }, function(error) {
                    errorMesage('Deleting failed!')
                })
            event.stopPropagation()
        });
    }

    var clickedEditProfileButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#edit-user-button', function(event) {
            event.preventDefault();
            var username = $('#username').val();
            var password = $('#password').val();
            var fullName = $('#fullName').val();
            var userId = sessionStorage.getItem('userId');
            _this._data._user.editProfile(username, password, fullName, userId)
                .then(function(data) {
                    successMesage('Profile changing is done!');
                    window.parent.location = '#/home';
                    return data;
                }, function(error) {
                    errorMesage('Profile changing failed!')
                })
            event.stopPropagation()
        });
    }

    var clickedLogout = function(selector) {
        var _this = this;
        $(selector).on('click', '#logout-link', function(event) {
            event.preventDefault();
            sessionStorage.clear();
            successMesage('Logout is done!');
            window.parent.location = '#/';
            event.stopPropagation()
        });
    }

    var getTargetPhoneData = function(event) {
        var targetTableRow = $(event.target).parents('tr');
        var dataArr = targetTableRow.children('td');
        var name = $(dataArr[0]).text();
        var number = $(dataArr[1]).text();
        var phoneId = targetTableRow.data('id');
        sessionStorage.setItem('personName', name);
        sessionStorage.setItem('phoneNumber', number);
        sessionStorage.setItem('phoneId', phoneId);
    }

    var successMesage = function(text) {
        noty({
            text: text,
            layout: 'topCenter',
            type: 'success',
            timeout: 5000,
            closeWith: ['button']

        })
    }

    var errorMesage = function(text) {
        noty({
            text: text,
            layout: 'topCenter',
            type: 'error',
            timeout: 5000,
            closeWith: ['button']

        })
    }

    return {
        get: function(data) {
            return new Controller(data);
        }
    }
}())
