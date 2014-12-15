var app = app || {};

(function() {
    var baseUrl = 'https://api.parse.com/1/';
    var selector = '#wrapper';
    var headertext = 'header span';
    var requester = app.requester.get();

    $(document).ready(function() {
        onFirstLoad();
    })

    function onFirstLoad() {
        app.router = Sammy(function() {
            this.get('#/', function() {
                loadHome();
            });

            this.get('#/login', function() {
                loadLoginForm();
            });

            this.get('#/registration', function() {
                loadRegistrationForm();
            });

            this.get('#/home', function() {
                if (sessionStorage.token) {
                    loadUserHomeScreen();
                } else {
                    loadHome();
                }
            });

            this.get('#/phonebook', function() {
                if (sessionStorage.token) {
                    getPhonebookData();
                } else {
                    loadHome();
                }
            });

            this.get('#/addphone', function() {
                if (sessionStorage.token) {
                    loadAddPhoneScreen();
                } else {
                    loadHome();
                }
            });

            this.get('#/editphone', function() {
                if (sessionStorage.token) {
                    loadEditForm();
                } else {
                    loadHome();
                }
            });

            this.get('#/deletephone', function() {
                if (sessionStorage.token) {
                    loadDeleteForm();
                } else {
                    loadHome();
                }
            });

            this.get('#/editprofile', function() {
                if (sessionStorage.token) {
                    loadProfileForm();
                } else {
                    loadHome();
                }
            });
        });

        app.router.run('#/');
        loadHome();
        attachEventHandlers();
    }

    function attachEventHandlers() {
        clickedRegistrationRegButton.call(this, selector);
        clickedLoginLoginButton.call(this, selector);
        clickedAddAddPhoneButton.call(this, selector);
        clickedDeletePhoneRecordLink.call(this, selector);
        clickedDeletePhoneRecordButton.call(this, selector);
        clickedEditPhoneRecordLink.call(this, selector);
        clickedEditPhoneRecordButton.call(this, selector);
        clickedLogoutLink.call(this, '#menu');
        clickedHomeMenuLink.call(this, '#menu');
        clickedEditProfileButton.call(this, selector);
    }

    function loadHome() {
        $('#menu').hide();
        sessionStorage.clear();
        window.parent.location = "#/";
        $(headertext).text(' - Welcome')
        $(selector).load('./templates/home.html');
    }

    function loadLoginForm() {
        $(headertext).text(' - Login')
        $(selector).load('./templates/loginForm.html');
    }

    function loadRegistrationForm() {
        $(headertext).text(' - Registration')
        $(selector).load('./templates/registrationForm.html');
    }

    function loadUserHomeScreen() {
        window.parent.location = "#/home";
        var data = {
            'username': sessionStorage.getItem('name'),
            'fullName': sessionStorage.getItem('fullName')
        }

        $.get('./templates/userHomeScreen.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
        $('#menu').show();
        $(headertext).text(' - Home')
    }

    function loadPhonebook(data) {
        $.get('./templates/phoneBook.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })
        $(headertext).text(' - List')
    }

    function loadAddPhoneScreen() {
        $(selector).load('./templates/addPhoneScreen.html');
        $(headertext).text(' - Add phone')
    }

    function loadEditForm(target) {
        window.parent.location = '#/editphone'
        var name = sessionStorage.getItem('editName');
        var phone = sessionStorage.getItem('editPhone');
        var id = sessionStorage.getItem('editId');

        var data = {
            'name': name,
            'phone': phone,
            'id': id
        }
        $.get('./templates/editForm.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })

        $(headertext).text(' - Edit Phone')

        sessionStorage.setItem('editObjectId', data.id)
    }

    function loadDeleteForm() {
        window.parent.location = '#/deletephone'
        var name = sessionStorage.getItem('deleteName');
        var phone = sessionStorage.getItem('deletePhone');
        var id = sessionStorage.getItem('deleteId');

        var data = {
            'name': name,
            'phone': phone,
            'id': id
        }

        $.get('./templates/deleteForm.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })

        $(headertext).text(' - Delete Phone')

        sessionStorage.setItem('deleteTargetId', data.id)
    }

    function loadProfileForm() {
        var username = sessionStorage.name;
        var fullName = sessionStorage.fullName;
        var password = sessionStorage.password;
        var userId = sessionStorage.userId;

        var userData = {
            'username': username,
            'password': password,
            'fullName': fullName
        }
        $.get('./templates/editProfile.html', function(template) {
            var output = Mustache.render(template, userData);
            $(selector).html(output);
        })
    }

    function clickedRegistrationRegButton(selector) {
        $(selector).on('click', '#register-reg-button', function(event) {
            event.preventDefault();
            getRegistrationData();
            event.stopPropagation()
        });
    }

    function clickedLoginLoginButton(selector) {
        $(selector).on('click', '#login-login-button', function(event) {
            event.preventDefault();
            getLoginData();
            event.stopPropagation()
        });
    }

    function clickedAddAddPhoneButton(selector) {
        $(selector).on('click', '#add-add-button', function(event) {
            event.preventDefault();
            getNewPhoneData();
            event.stopPropagation()
        });
    }

    function clickedDeletePhoneRecordLink(selector) {
        $(selector).on('click', '#delete-record', function(event) {
            event.preventDefault();

            var target = $(event.target).parents('tr');
            var arr = target.children('td');
            var name = $(arr[0]).text();
            var phone = $(arr[1]).text();
            var id = target.data('id');

            sessionStorage.setItem('deleteName', name);
            sessionStorage.setItem('deletePhone', phone);
            sessionStorage.setItem('deleteId', id);
            loadDeleteForm()

            event.stopPropagation()
        });
    }

    function clickedDeletePhoneRecordButton() {
        $(selector).on('click', '#delete-delete-button', function(event) {
            event.preventDefault();
            makeDeletePhoneRecord();
            event.stopPropagation()
        });
    }

    function clickedDeleteCancelButton(selector) {
        $(selector).on('click', '#delete-cancel-button', function(event) {
            event.preventDefault();
            sessionStorage.removeItem('deleteTargetId')
            getPhonebookData();
            event.stopPropagation()
        });
    }

    function clickedEditPhoneRecordLink(selector) {
        $(selector).on('click', '#edit-record', function(event) {
            event.preventDefault();
            var target = $(event.target).parents('tr');
            var arr = target.children('td');
            var name = $(arr[0]).text();
            var phone = $(arr[1]).text();
            var id = target.data('id');

            sessionStorage.setItem('editName', name);
            sessionStorage.setItem('editPhone', phone);
            sessionStorage.setItem('editId', id);

            loadEditForm();
            event.stopPropagation()
        });
    }

    function clickedEditPhoneRecordButton(selector) {
        $(selector).on('click', '#edit-edit-button', function(event) {
            event.preventDefault();
            getNewPhoneRecordData();
            event.stopPropagation()
        });
    }

    function clickedLogoutLink(selector) {
        $(selector).on('click', '#logout-link', function(event) {
            event.preventDefault();
            sessionStorage.clear();
            $('#menu').hide();
            loadHome();
            event.stopPropagation()
        });
    }

    function clickedHomeMenuLink(selector) {
        $(selector).on('click', '#menu-home-link', function(event) {
            event.preventDefault();
            loadUserHomeScreen();
            event.stopPropagation()
        });
    }

    function clickedEditProfileButton(selector) {
        $(selector).on('click', '#edit-profile-button', function(event) {
            event.preventDefault();
            getNewProfileData();
            event.stopPropagation()
        });
    }

    var getRegistrationData = function() {
        var username = $('#username').val();
        var password = $('#password').val();
        var fullName = $('#fullName').val();
        //TODO: Make validation!

        makeRegistration(username, password, fullName);
    }

    var getLoginData = function() {
        var username = $('#username').val();
        var password = $('#password').val();
        makeLogin(username, password);
    }

    var getPhonebookData = function() {
        requester.get(baseUrl + 'classes/Phone')
            .then(function(data) {
                sessionStorage.removeItem('editObjectId');
                sessionStorage.removeItem('deleteTargetId');
                loadPhonebook(data);
                return data;
            }, function(error) {
                errorMessage('Loading phonebook failed!')
            })
    }

    var getNewPhoneData = function() {
        var personName = $('#personName').val();
        var phoneNumber = $('#phoneNumber').val();
        makeAddNewPhone(personName, phoneNumber);
    }

    var getNewPhoneRecordData = function() {
        var name = $('#personName').val();
        var number = $('#phoneNumber').val();
        makeEditPhoneRecord(name, number);
    }

    var getNewProfileData = function() {
        var username = $('#username').val();
        var password = $('#password').val();
        var fullName = $('#fullName').val();

        makeEditProfile(username, password, fullName);
    }

    var makeRegistration = function(username, password, fullName) {
        var userData = {
            'username': username,
            'password': password,
            'fullName': fullName
        }

        requester.post(baseUrl + 'users', userData)
            .then(function(data) {
                sessionStorage.setItem('name', username);
                sessionStorage.setItem('fullName', fullName);
                sessionStorage.setItem('password', password);
                sessionStorage.setItem('userId', data.objectId);
                sessionStorage.setItem('token', data.sessionToken);
                succesMessage('Registration is done!')
                loadUserHomeScreen();
                return data;
            }, function(error) {
                errorMessage('Registration failed!')
            })
    }

    var makeLogin = function(username, password) {
        requester.get(baseUrl + 'login?username=' + username + '&password=' + password)
            .then(function(data) {
                sessionStorage.setItem('name', data.username);
                sessionStorage.setItem('password', password);
                sessionStorage.setItem('userId', data.objectId);
                sessionStorage.setItem('fullName', data.fullName);
                sessionStorage.setItem('token', data.sessionToken);
                succesMessage('Login is successful!')
                loadUserHomeScreen();
                return data;
            }, function(error) {
                errorMessage('Login failed!')
            })
    }

    var makeAddNewPhone = function(personName, phoneNumber) {
        var data = {
            'person': personName,
            'number': phoneNumber,
            'ACL': {}
        }

        var userId = sessionStorage.getItem('userId');
        data.ACL[userId] = {
            "write": true,
            "read": true
        }
        requester.post(baseUrl + 'classes/Phone', data)
            .then(function(data) {
                requester.get(baseUrl + 'classes/Phone')
                    .then(function(data) {
                        window.parent.location = '#/phonebook';
                        // loadPhonebook(data)
                        succesMessage('Adding phone record is done!')
                    }, function(error) {
                        errorMessage('Loading new record failed!')
                    })
            }, function(error) {
                errorMessage('Adding failed!');
            })
    }

    var makeDeletePhoneRecord = function() {
        var objectId = sessionStorage.getItem('deleteTargetId');
        requester.del(baseUrl + 'classes/Phone/' + objectId)
            .then(function(data) {
                succesMessage('Phone record is delete!')
                getPhonebookData();
                return data;
            }, function(error) {
                errorMessage('Deleting failed!')
            })
    }

    var makeEditPhoneRecord = function(name, number) {
        var data = {
            'person': name,
            'number': number
        }
        var objectId = sessionStorage.getItem('editObjectId')
        requester.put(baseUrl + 'classes/Phone/' + objectId, data)
            .then(function(data) {
                succesMessage('Edit phone record is done!')
                getPhonebookData();
            }, function(error) {
                errorMessage('Editing failed!')
            })
    }

    var makeEditProfile = function(username, password, fullName) {
        var userId = sessionStorage.userId;
        var userData = {
            'username': username,
            'password': password,
            'fullName': fullName
        }
        requester.put(baseUrl + 'users/' + userId, userData)
            .then(function(data) {
                succesMessage('Updating profile done!')
                makeLogin(username, password);
            }, function(error) {
                errorMessage('Upadting profile failed!')
            })
    }

    function succesMessage(text) {
        noty({
            text: text,
            layout: 'topCenter',
            type: 'success',
            timeout: 5000,
            closeWith: ['button']

        })
    }

    function errorMessage(text) {
        noty({
            text: text,
            layout: 'topCenter',
            type: 'error',
            timeout: 5000,
            closeWith: ['button']

        })
    }
}())
