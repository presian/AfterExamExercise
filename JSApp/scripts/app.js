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
        loadHome();
        attachEventHandlers();
    }

    function attachEventHandlers() {
        clickedHomeLoginButton.call(this, selector);
        clickedHomeRegistrationButton.call(this, selector);
        clickedLoginRegistrationLink.call(this, selector);
        clickedRegistrationLoginLink.call(this, selector);
        clickedRegistrationRegButton.call(this, selector);
        clickedLoginLoginButton.call(this, selector);
        clickedPhonebookLink.call(this, '#menu');
        clickedAddPhoneButton.call(this, selector);
        clickedAddAddPhoneButton.call(this, selector);
        clickedAddCancelButton.call(this, selector);
        clickedDeletePhoneRecordLink.call(this, selector);
        clickedDeletePhoneRecordButton.call(this, selector);
        clickedDeleteCancelButton.call(this, selector);
        clickedEditPhoneRecordLink.call(this, selector);
        clickedEditPhoneRecordButton.call(this, selector);
        clickedEditCancelButton.call(this, selector);
        clickedLogoutLink.call(this, '#menu');
        clickedAddPhoneLink.call(this, '#menu');
        clickedHomeMenuLink.call(this, '#menu');
    }

    function loadHome() {
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
        var arr = target.parents('tr').children('td');
        var name = $(arr[0]).text();
        var phone = $(arr[1]).text();

        var data = {
            'name': name,
            'phone': phone
        }
        $.get('./templates/editForm.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })

        $(headertext).text(' - Edit Phone')

        var objectId = target.parents('tr').data('id')
        sessionStorage.setItem('editObjectId', objectId)
    }

    function loadDeleteForm(target) {
        var arr = target.children('td');
        var name = $(arr[0]).text();
        var phone = $(arr[1]).text();
        var data = {
            'name': name,
            'phone': phone
        }

        $.get('./templates/deleteForm.html', function(template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        })

        $(headertext).text(' - Delete Phone')

        sessionStorage.setItem('deleteTargetId', target.data('id'))
    }

    function clickedHomeLoginButton(selector) {
        $(selector).on('click', '#home-login-button', function(event) {
            event.preventDefault();
            loadLoginForm();
            event.stopPropagation()
        });
    }

    function clickedHomeRegistrationButton(selector) {
        $(selector).on('click', '#home-register-button', function(event) {
            event.preventDefault();
            loadRegistrationForm();
            event.stopPropagation()
        });
    }

    function clickedLoginRegistrationLink(selector) {
        $(selector).on('click', '#login-reg-link', function(event) {
            event.preventDefault();
            loadRegistrationForm();
            event.stopPropagation()
        });
    }

    function clickedRegistrationLoginLink(selector) {
        $(selector).on('click', '#register-login-link', function(event) {
            event.preventDefault();
            loadLoginForm();
            event.stopPropagation()
        });
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

    function clickedPhonebookLink(menu) {
        $(menu).on('click', '#menu-phonebook-link', function(event) {
            event.preventDefault();
            getPhonebookData();
            event.stopPropagation()
        });
    }

    function clickedAddPhoneButton(selector) {
        $(selector).on('click', '#add-phone-button', function(event) {
            event.preventDefault();
            loadAddPhoneScreen();
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

    function clickedAddCancelButton(selector) {
        $(selector).on('click', '#add-cancel-button', function(event) {
            event.preventDefault();
            getPhonebookData();
            event.stopPropagation()
        });
    }

    function clickedDeletePhoneRecordLink(selector) {
        $(selector).on('click', '#delete-record', function(event) {
            event.preventDefault();
            var target = $(event.target).parents('tr');
            loadDeleteForm(target)
            event.stopPropagation()
        });
    }

    function clickedDeletePhoneRecordButton() {
        $(selector).on('click', '#delete-delete-button', function(event) {
            event.preventDefault();
            var objectId = sessionStorage.getItem('deleteTargetId');
            makeDeletePhoneRecord(objectId);
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
            var target = $(event.target);
            loadEditForm(target);
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

    function clickedEditCancelButton(selector) {
        $(selector).on('click', '#edit-cancel-button', function(event) {
            event.preventDefault();
            sessionStorage.removeItem('editObjectId');
            getPhonebookData();
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

    function clickedAddPhoneLink(selector) {
        $(selector).on('click', '#add-phone-link', function(event) {
            event.preventDefault();
            loadAddPhoneScreen();
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
                        loadPhonebook(data)
                        succesMessage('Adding phone record is done!')
                    }, function(error) {
                        errorMessage('Loading new record failed!')
                    })
            }, function(error) {
                errorMessage('Adding failed!');
            })
    }

    var makeDeletePhoneRecord = function(objectId) {
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
