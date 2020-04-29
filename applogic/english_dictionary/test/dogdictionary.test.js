const axios = require('axios');
var expect = require('expect');
it('check dog breed list URL', async () => {
	expect.assertions(1);
	const dogBreeds = await axios.get('https://dog.ceo/api/breeds/list/all');
	const breedInfo = dogBreeds.data['message'];
	var keys = Object.keys(breedInfo);

	expect(typeof keys).toBe('object');
});
