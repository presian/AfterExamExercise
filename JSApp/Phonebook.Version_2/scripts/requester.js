var app = app || {};

app.requester = (function() {
    function Requester() {}

    function makeRequest(url, method, data) {
        var def = Q.defer();
        $.ajax({
            headers: {
                "X-Parse-Application-Id": 'i0hArC1BCToxlKOIXJjLZpUzADC5LBV0F9xSuDcU',
                "X-Parse-REST-API-Key": 'K3LYPPkh2nDuS2Dt1lbNmbfQV0r5iyU2T2BcclDK',
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
        });

        return def.promise;
    }

    Requester.prototype.get = function(url) {
        return makeRequest(url, 'GET', null)
    };

    Requester.prototype.put = function(url, data) {
        return makeRequest(url, 'PUT', data)
    };

    Requester.prototype.post = function(url, data) {
        return makeRequest(url, 'POST', data)
    };

    Requester.prototype.del = function(url) {
        return makeRequest(url, 'DELETE', null)
    };

    return {
        get: function() {
            return new Requester();
        }
    }
}());
