'use strict';

module.exports.photoObjToURL = function(photoObj){
	// return 'https://farm2.staticflickr.com/1577/24770505034_31a9986429_b.jpg';
    return 'https://farm' + photoObj.farm + '.staticflickr.com/' + photoObj.server + '/' + photoObj.id + '_' +
        photoObj.secret + '_b.jpg';
}