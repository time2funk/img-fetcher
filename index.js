'use strict';

var expect = require('chai').expect;

describe('FlickrFetcher', ()=>{
	it('should exist', ()=>{
		var FlickrFetcher = require('./flickr-fetcher.js');
		expect(FlickrFetcher).to.not.be.undefined;
	})
});
