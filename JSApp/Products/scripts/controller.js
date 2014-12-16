var app = app || {};

app.controller = (function() {
    function Controller(data) {
        this._data = data;
    }

    Controller.prototype.loadWelcome = function(selector) {
        $('#home-menu').hide();
        $(selector).load('./templates/welcome-wrapper.html');
    };

    Controller.prototype.loadLogin = function(selector) {
        $('#home-menu').hide();
        $(selector).load('./templates/login.html');
    };

    Controller.prototype.loadRegistration = function(selector) {
        $('#home-menu').hide();
        $(selector).load('./templates/registration.html');
    };

    Controller.prototype.loadHome = function(selector) {
        $('#welcome-menu').hide();
        $('#home-menu').show();
        var userData = {
            'username': sessionStorage.getItem('username')
        }
        $.get('./templates/home.html', function(template) {
            var output = Mustache.render(template, userData);
            $(selector).html(output);
        })
    };

    Controller.prototype.loadProducts = function(selector) {
        sessionStorage.removeItem('ProductName');
        sessionStorage.removeItem('ProductCategory');
        sessionStorage.removeItem('ProductPrice');
        sessionStorage.removeItem('ProductId');

        this._data._product.getAll()
            .then(function(data) {
                $.get('./templates/list-products.html', function(template) {
                    var output = Mustache.render(template, data);
                    $(selector).html(output);
                })
                $.get('./templates/filter.html', function(template) {
                    var output = Mustache.render(template, data);
                    $('.filters').html(output);
                })
                return data;
            }, function(error) {
                errorMessage('Loading products failed!')
            })
    };

    Controller.prototype.loadAddProduct = function(selector) {
        $(selector).load('./templates/add-product.html');
    };

    Controller.prototype.loadEditProduct = function(selector) {
        var editData = {
            'name': sessionStorage.getItem('ProductName'),
            'category': sessionStorage.getItem('ProductCategory'),
            'price': sessionStorage.getItem('ProductPrice'),
            'productId': sessionStorage.getItem('ProductId')
        }

        $.get('./templates/edit-product.html', function(template) {
            var output = Mustache.render(template, editData);
            $(selector).html(output);
        })
    };

    Controller.prototype.loadDeleteProduct = function(selector) {
        var deleteData = {
            'name': sessionStorage.getItem('ProductName'),
            'category': sessionStorage.getItem('ProductCategory'),
            'price': sessionStorage.getItem('ProductPrice'),
            'productId': sessionStorage.getItem('ProductId')
        }

        $.get('./templates/delete-product.html', function(template) {
            var output = Mustache.render(template, deleteData);
            $(selector).html(output);
        })
    };


    Controller.prototype.attachEventListeners = function(selector) {
        clickedRegButton.call(this, selector);
        clickedLoginButton.call(this, selector);
        clickedAddProductButton.call(this, selector);
        clickedEditProductButton.call(this, selector);
        clickedProductEditButton.call(this, selector);
        clickedDeleteProductButton.call(this, selector);
        clickedProductDeleteButton.call(this, selector);
        clickedFilterButton.call(this, selector);
        clickedClearFilter.call(this, selector);
        clickedLogoutButton.call(this, '#home-menu');
    }

    var clickedRegButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#register-button', function(event) {
            event.preventDefault();
            var username = $('#username').val();
            var password = $('#password').val();
            var repass = $('#confirm-password').val();
            if (password !== repass) {
                return errorMessage('Please enter same password twice!');
            } else {
                _this._data._user.makeRegistration(username, password)
                    .then(function(data) {
                        successMessage('Registration is done!');
                        window.parent.location = '#/home';
                        return data;
                    }, function(error) {
                        errorMessage('Registration failed!')
                    })
            }

            event.stopPropagation()
        });
    }

    var clickedLoginButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#login-button', function(event) {
            event.preventDefault();
            var username = $('#username').val();
            var password = $('#password').val();
            _this._data._user.makeLogin(username, password)
                .then(function(data) {
                    successMessage('Login is done!');
                    window.parent.location = '#/home';
                    return data;
                }, function(error) {
                    errorMessage('Login failed!')
                })
            event.stopPropagation()
        });
    }

    var clickedAddProductButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#add-product-button', function(event) {
            event.preventDefault();
            var name = $('#name').val();
            var category = $('#category').val();
            var price = $('#price').val();
            _this._data._product.addProduct(name, category, price)
                .then(function(data) {
                    window.parent.location = '#/products';
                    successMessage('Product is added!')
                    return data;
                }, function(error) {
                    errorMessage('Adding failed!')
                })
            event.stopPropagation()
        });
    }

    var clickedEditProductButton = function(selector) {
        var _this = this;
        $(selector).on('click', '.edit-button', function(event) {
            event.preventDefault();
            productDataPreparetor(event.target);
            window.parent.location = '#/editproduct'
            event.stopPropagation()
        });
    }

    var clickedProductEditButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#edit-product-button', function(event) {
            event.preventDefault();
            var name = $('#item-name').val();
            var category = $('#category').val();
            var price = parseFloat($('#price').val());
            var productId = $(event.target).parents('.panel').data('id');
            _this._data._product.makeEditProduct(name, category, price, productId)
                .then(function(data) {
                    successMessage('Editing is done!')
                    window.parent.location = '#/products';
                    return data;
                }, function(error) {
                    errorMessage('Editing failed!')
                })
            event.stopPropagation()
        });
    }

    var clickedDeleteProductButton = function(selector) {
        var _this = this;
        $(selector).on('click', '.delete-button', function(event) {
            event.preventDefault();
            productDataPreparetor(event.target)
            window.parent.location = '#/deleteproduct'
            event.stopPropagation()
        });
    }

    var clickedProductDeleteButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#delete-product-button', function(event) {
            event.preventDefault();
            var productId = $(event.target).parents('.panel').data('id');
            _this._data._product.makeDeleteProduct(productId)
                .then(function(data) {
                    successMessage('Deleting is done!');
                    window.parent.location = '#/products';
                    return data;
                }, function(error) {
                    errorMessage('Deleting failed!')
                })
            event.stopPropagation()
        });
    }

    var clickedFilterButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#filter', function(event) {
            event.preventDefault();

            var keyword = $('#search-bar').val();
            var minPrice = parseFloat($('#min-price').val());
            var maxPrice = parseFloat($('#max-price').val());
            var category = $('#category').val();
            $('.products').show();

            if (keyword) {
                $('.item-name').filter(function() {
                    if ($(this).data('name') !== keyword) {
                        $(this).parents('.product').hide();
                    };
                });
            }

            $('.price').filter(function() {
                var productPrice = parseFloat($(this).data('price'))
                var isPriceBetweenMinAndMax = priceChecker(minPrice, maxPrice, productPrice);
                if (isPriceBetweenMinAndMax === false) {
                    $(this).parents('.product').hide();
                };
            });

            if (category !== 'All') {
                $('.category').filter(function() {
                    if ($(this).data('category') !== category) {
                        $(this).parents('.product').hide();
                    };
                });
            };

            event.stopPropagation()
        });

        function priceChecker(min, max, actualPrice) {
            if (min > actualPrice || max < actualPrice) {
                return false;
            } else {
                return true;
            }
        }
    }

    var clickedClearFilter = function(selector) {
        $(selector).on('click', '#clear-filters', function(event) {
            event.preventDefault();
            $('.product').show();
            event.stopPropagation()
        });
    }

    var clickedLogoutButton = function(selector) {
        var _this = this;
        $(selector).on('click', '#logout-button', function(event) {
            event.preventDefault();
            sessionStorage.clear();
            $('#welcome-menu').show();
            window.parent.location = '#/';
            successMessage('Logout is done!');
            event.stopPropagation()
        });
    }

    var productDataPreparetor = function(target) {
        var targetProduct = $(target).parents('li');
        var productId = targetProduct.data('id');
        var name = targetProduct.children('div').children('.item-name').data('name');
        var category = targetProduct.children('div').children('.category').data('category');
        var price = targetProduct.children('div').children('.price').data('price');
        sessionStorage.setItem('ProductName', name);
        sessionStorage.setItem('ProductCategory', category);
        sessionStorage.setItem('ProductPrice', price);
        sessionStorage.setItem('ProductId', productId);
    }

    var successMessage = function(text) {
        noty({
            text: text,
            layout: 'bottomCenter',
            type: 'success',
            timeout: 5000,
            closeWith: ['button']

        })
    }

    var errorMessage = function(text) {
        noty({
            text: text,
            layout: 'bottomCenter',
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
