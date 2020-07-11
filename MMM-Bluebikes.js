/* global Module, Log */

/*
 * Magic Mirror Module: MMM-Bubi (https://github.com/balassy/MMM-Bubi)
 * By György Balássy (https://www.linkedin.com/in/balassy)
 * MIT Licensed.
 */

Module.register('MMM-Bluebikes', {
    defaults: {
	updateInterval: 30000,
	showPlaceName: true,
	url: "https://gbfs.bluebikes.com/gbfs/en/station_status.json",
	places: [
	    {id: "76", name: "City Hall"},
	    {id: "116", name: "359 Broadway"},
	    {id: "107", name: "TPP"}
	]
    },
    
    viewModel: {
	places: []
    },

    requiresVersion: '2.1.0',

    getStyles() {
	return [
	    'MMM-Bluebikes.css'
	];
    },

    start() {
	const self = this;
	this.hasData = false;

	this._getData(() => self.updateDom());

	setInterval(() => {
	    self._getData(() => self.updateDom());
	}, this.config.updateInterval);
    },

    getDom() {
	const wrapper = document.createElement('div');

	if (this.viewModel) {
	    const tableEl = document.createElement('table');
	    tableEl.classList = 'small';

	    if (this.config.align === 'left') {
		tableEl.classList += ' align-left';
	    }

	    if (this.config.align === 'right') {
		tableEl.classList += ' align-right';
	    }

	    const rowEl = document.createElement('tr');
	    const symbolEl = document.createElement('th');
	    symbolEl.classList = 'fa fa-bicycle dimmed symbol-cell';
	    rowEl.appendChild(symbolEl);
	    
	    const countEl = document.createElement('th');
	    countEl.classList = 'count-cell';
	    countEl.innerText = '# Bikes';
	    rowEl.appendChild(countEl);

	    const dockEl = document.createElement('th');
	    dockEl.classList = 'count-cell';
	    dockEl.innerText = '# Docks';
	    rowEl.appendChild(dockEl);

	    
	    const nameEl = document.createElement('th');
	    nameEl.classList = 'dimmed small name-cell';
	    nameEl.innerText = 'Location';
	    rowEl.appendChild(nameEl);
	    tableEl.appendChild(rowEl);
	    
	    this.viewModel.places.forEach((place) => {
		const rowEl = document.createElement('tr');

		const symbolEl = document.createElement('td');
		symbolEl.classList = 'fa fa-bicycle dimmed symbol-cell';
		rowEl.appendChild(symbolEl);

		const countEl = document.createElement('td');
		countEl.classList = 'count-cell';
		countEl.innerText = place.numberOfBikes;
		rowEl.appendChild(countEl);

		const dockEl = document.createElement('td');
		dockEl.classList = 'count-cell';
		dockEl.innerText = place.numberOfDocks;
		rowEl.appendChild(dockEl);


		const nameEl = document.createElement('td');
		nameEl.classList = 'dimmed small name-cell';
		nameEl.innerText = place.name;
		rowEl.appendChild(nameEl);

		tableEl.appendChild(rowEl);
	    });

	    wrapper.appendChild(tableEl);

	    const clearfixEl = document.createElement('div');
	    clearfixEl.classList = 'clearfix';
	    wrapper.appendChild(clearfixEl);
	} else {
	    const loadingEl = document.createElement('span');
	    loadingEl.innerHTML = this.translate('LOADING');
	    loadingEl.classList = 'dimmed small';
	    wrapper.appendChild(loadingEl);
	}

	return wrapper;
    },

    _getData(onCompleteCallback) {
	const self = this;

	const xhr = new XMLHttpRequest();
	xhr.open('GET', this.config.url, true);
	xhr.onreadystatechange = function onReadyStateChange() {
	    if (this.readyState === 4) {
		if (this.status === 200) {
		    self._processResponse(this.response);
		    onCompleteCallback();
		} else {
		    Log.error(self.name, `MMM-Bluebikes: Failed to load data. XHR status: ${this.status}`);
		}
	    }
	};

	xhr.send();
    },

    _processResponse(responseBody) {
	const response = JSON.parse(responseBody);
	const places = response.data.stations;
	this.viewModel.places = [];

	
	for (let i = 0; i < this.config.places.length; i++) {
	    const place = places.find(p => p.station_id === this.config.places[i].id);

	    // const place = places[this.config.places[i].id];
	    Log.log(place);
	    this.viewModel.places.push({
		name: this.config.showPlaceName
		    ? this.config.places[i].name// || place.name
		    : null,
		numberOfBikes: place.num_bikes_available,
		numberOfDocks: place.num_docks_available
	    });
	}

	if (!this.hasData) {
	    this.updateDom();
	}

	this.hasData = true;
    }
});
