var app = app || {};

app.data = (function() {
    function Data(url, requester) {
        this._user = new User(url, requester);
        this._product = new Product(url, requester);
    }

    var User = (function() {
        function User(url, requester) {
            this._url = url;
            this._requester = requester;
        }

        User.prototype.makeRegistration = function(username, password) {
            var userData = {
                'username': username,
                'password': password
            }

            return this._requester.post(this._url + 'users', userData)
                .then(function(data) {
                    sessionStorage.setItem('token', data.sessionToken);
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('userId', data.objectId);
                    return data;
                })
        };

        User.prototype.makeLogin = function(username, password) {
            var requestUrl = this._url + 'login?username=' + username + '&password=' + password;
            return this._requester.get(requestUrl)
                .then(function(data) {
                    sessionStorage.setItem('token', data.sessionToken);
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('userId', data.objectId);
                    return data;
                })
        };

        return User;
    }())

    var Product = (function() {
        function Product(url, requester) {
            this._url = url;
            this._requester = requester;
        }

        Product.prototype.addProduct = function(name, category, price) {
            var productData = {
                'name': name,
                'category': category,
                'price': parseFloat(price),
                'ACL': {}
            }

            var userId = sessionStorage.getItem('userId');
            productData.ACL[userId] = {
                'read': true,
                'write': true
            }

            var requestUrl = this._url + 'classes/Product';
            return this._requester.post(requestUrl, productData);
        };

        Product.prototype.getAll = function() {
            return this._requester.get(this._url + 'classes/Product');
        };

        Product.prototype.makeEditProduct = function(name, category, price, productId) {
            var productData = {
                'name': name,
                'category': category,
                'price': price
            }
            var requestUrl = this._url + 'classes/Product/' + productId;
            return this._requester.put(requestUrl, productData);
        };

        Product.prototype.makeDeleteProduct = function(productId) {
            return this._requester.del(this._url + 'classes/Product/' + productId);
        };

        return Product;
    }())

    return {
        get: function(url, requester) {
            return new Data(url, requester);
        }
    }
}())
