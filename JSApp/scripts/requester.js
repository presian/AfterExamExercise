var app = app || {};

app.requester = (function() {
    function Requester() {
        this.get = makeGetRequest;
        this.post = makePostRequest;
        this.put = makePutRequest;
        this.del = makeDeleteRequest;
    };

    var makeRequest = function(url, method, data) {
        var def = Q.defer();
        $.ajax({
            headers: {
                "X-Parse-Application-Id": 'iNzEGLEZ6UADBgVKBAddy1ayhHLcuvEg1HWPQnxs',
                "X-Parse-REST-API-Key": 'KMTGAbzNkZKVH8TK7uWO5IdWgUB3gBULhBPe0Q27',
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
                def.reject(error)
            }
        });

        return def.promise;
    }

    var makeGetRequest = function(url) {
        return makeRequest(url, 'GET', null);
    }

    var makePostRequest = function(url, data) {
        return makeRequest(url, 'POST', data)
    }

    var makePutRequest = function(url, data) {
        return makeRequest(url, 'PUT', data);
    }

    var makeDeleteRequest = function(url) {
        return makeRequest(url, 'DELETE');
    }

    return {
        get: function() {
            return new Requester();
        }
    };
}());
