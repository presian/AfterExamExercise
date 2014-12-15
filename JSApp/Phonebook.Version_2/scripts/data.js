var app = app || {};

app.dataManager = (function() {
    function Data(url, requester) {
        this._user = new User(url, requester);
        this._phone = new Phone(url, requester);
    }

    var dataStorage = (function() {
        var setSessionToken = function(sessionToken) {
            sessionStorage.setItem('token', sessionToken);
        }

        var setUserId = function(userId) {
            sessionStorage.setItem('userId', userId);
        }

        var setUserName = function(username) {
            sessionStorage.setItem('username', username);
        }

        var setPassword = function(password) {
            sessionStorage.setItem('password', password);
        }

        var setFullName = function(fullName) {
            sessionStorage.setItem('fullName', fullName);
        }

        return {
            setSessionToken: setSessionToken,
            setUserId: setUserId,
            setUserName: setUserName,
            setPassword: setPassword,
            setFullName: setFullName,
        }
    }())

    var User = (function() {
        function User(url, requester) {
            this._url = url;
            this._requester = requester;
        };

        User.prototype.registration = function(username, password, fullName) {
            var regData = {
                'username': username,
                'password': password,
                'fullName': fullName
            }

            return this._requester.post(this._url + 'users', regData)
                .then(function(data) {
                    dataStorage.setSessionToken(data.sessionToken);
                    dataStorage.setUserId(data.objectId);
                    dataStorage.setUserName(username);
                    dataStorage.setPassword(password);
                    dataStorage.setFullName(fullName);
                    return data;
                })
        };

        User.prototype.login = function(username, password) {
            var logData = {
                'usernaem': username,
                'password': password
            }
            var requestUrl = this._url + 'login?username=' + username + '&password=' + password;
            return this._requester.get(requestUrl)
                .then(function(data) {
                    dataStorage.setSessionToken(data.sessionToken);
                    dataStorage.setUserId(data.objectId);
                    dataStorage.setUserName(data.username);
                    dataStorage.setPassword(password);
                    dataStorage.setFullName(data.fullName);
                    return data;
                })
        };

        User.prototype.editProfile = function(username, password, fullName, userId) {
            var userData = {
                'username': username,
                'password': password,
                'fullName': fullName
            }

            var requestUrl = this._url + 'users/' + userId;
            return this._requester.put(requestUrl, userData)
                .then(function(data) {
                    dataStorage.setUserName(username);
                    dataStorage.setPassword(password);
                    dataStorage.setFullName(fullName);
                    return data;
                })
        };

        return User;
    }());

    var Phone = (function() {
        function Phone(url, requester) {
            this._url = url;
            this._requester = requester;
        }

        Phone.prototype.getAll = function() {
            return this._requester.get(this._url + 'classes/Phone');
        };

        Phone.prototype.addPhone = function(personName, phoneNumber) {
            var requestUrl = this._url + 'classes/Phone';
            var userData = {
                'name': personName,
                'number': phoneNumber,
                'ACL': {}
            }
            userData.ACL[sessionStorage.userId] = {
                'write': true,
                'read': true
            }
            return this._requester.post(requestUrl, userData);
        };

        Phone.prototype.editPhone = function(name, number, objectId) {
            var phoneData = {
                'name': name,
                'number': number,
            }

            var requestUrl = this._url + 'classes/Phone/' + objectId;

            return this._requester.put(requestUrl, phoneData);
        };

        Phone.prototype.deletePhone = function(objectId) {
            var requestUrl = this._url + 'classes/Phone/' + objectId;
            return this._requester.del(requestUrl);
        };

        return Phone;
    })();

    return {
        get: function(url, requester) {
            return new Data(url, requester);
        }
    }
}())
