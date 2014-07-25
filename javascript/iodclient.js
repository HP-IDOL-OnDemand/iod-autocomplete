String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


var IODClient = function(apikey, apiurl) {
	this.apikey = apikey;
	var apiurl = typeof apiurl !== 'undefined' ? apiurl : 'http://api.idolondemand.com';
	console.log(apiurl)
	this.apiurl = apiurl;
};


IODClient.prototype = {

	post: function(handler, params, callback) {
		var method = $.post;
		this.call(handler, params, method, callback);
	},
	get: function(handler, params, callback) {
		var method = $.get;
		this.call(handler, params, method, callback);
	},

	call: function(handler, params, callback, method) {
		method = typeof method !== 'undefined' ? method : $.post;
		callback = typeof callback !== 'undefined' ? callback : function(data) {
			console.log(data)
		};

		params['apikey'] = this.apikey;
		method(this.generateURL(handler), params, callback);
	},

	generateURL: function(handler) {
		return this.apiurl + "/1/api/sync/" + handler + "/v1";
	},

	Index: function(client, name, type) {
		this.name = name;
		this.client = client;
	},

	getIndex: function(name) {
		return new this.Index(this, name)
	}
}


IODClient.prototype.Index.prototype = {

	query: function(text, params, callback, method) {
		params = typeof params !== 'undefined' ? params : {};
		params['indexes'] = this.name;
		params['text'] = text
		this.client.call('querytextindex', params, callback, method);
	},
	call: function(handler, params, callback, method) {
		this.client.call(handler, params, callback, method);
	},

	autocomplete: function(text,params,config,callback,method) {

		if (config.wildcard && !text.endsWith(" ")){
			text+="*"
		}
		text='('+text+'):'+config.field;
		this.query(text,params,callback,method);
	},

    ttAdapter: function(params,config) {
            var self = this;

            return function(query, cb) {
                self.autocomplete(query, params ,config,function(data) {
                        cb(data.documents);
                    
                });
            };
     },
}


