var app = app || {};

app.requester = (function() {
    function Requester() {}

    var makeRequest = function(url, method, data) {
        var def = Q.defer();

        $.ajax({
            headers: {
                "X-Parse-Application-Id": 'kNhBoRPluMaYYxP81eefBk26xO51uulhDmOFXOmC',
                "X-Parse-REST-API-Key": 'zySxZ2ZLr94TGZDyADsTzpJ7FjV1raNvEygRg6JX',
                "X-Parse-Session-Token": sessionStorage.getItem('token')
            },
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(data) {
                def.resolve(data);
            },
            error: function(error) {
                def.reject(error);
            }
        })

        return def.promise;
    }

    Requester.prototype.get = function(url) {
        return makeRequest(url, 'GET', null);
    }

    Requester.prototype.put = function(url, data) {
        return makeRequest(url, 'PUT', data);
    }

    Requester.prototype.post = function(url, data) {
        return makeRequest(url, 'POST', data);
    }

    Requester.prototype.del = function(url) {
        return makeRequest(url, 'DELETE', null);
    };

    return {
        get: function() {
            return new Requester();
        }
    }
}())
