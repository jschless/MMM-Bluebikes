Module.register("MMM-Bluebikes", {
    defaults: {
        apikey: "",
        updateInterval: 10, // In seconds
	url: 'https://gbfs.bluebikes.com/gbfs/en/station_status.json',
        stations: [ "Fan Pier" ],
        maxEntries: 8,
        maxTime: 0,
        fade: true,
        fadePoint: 0.25, // Start on 1/4th of the list.
        showFullName: false,
        colorIcons: false,
        showAlerts: false,  // works but styling needs help
        hideEmptyAlerts: false,
    },

    getStyles: function() {
        return ["font-awesome.css", "MMM-MBTA.css"];
    },

    getHeader: function() {
        return this.data.header + " " + this.config.stations[0];
    },

    getScripts: function () {
        return ["moment.js", "https://code.jquery.com/jquery-3.3.1.min.js"];
    },

    start: function() {
        // API abuse prevention
        this.config.fadePoint = Math.max(this.config.fadePoint, 0);
        this.config.updateInterval = Math.max(this.config.updateInterval, 10);

        this.loaded = false;
        this.getStations = fetch('modules/MMM-Bluebikes/stations-formatted.json')
            .then(res => res.json())
            .then(stationDict => this.config.stations.map(friendlyName => stationDict[friendlyName]));

        this.stationData = [];
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        if (!this.loaded) {
            wrapper.innerHTML += "LOADING";
            wrapper.className = "dimmed light small";
        }

        var table = document.createElement("table");
        table.className = "small";

        // When there are no predictions
        if (!this.stationData.length) {
            var row = document.createElement("tr");
            table.appendChild(row);

            // Icon
            var symbolCell = document.createElement("td");
            symbolCell.className = "fa fa-times-circle";
            symbolCell.style.cssText = "padding-right: 10px";
            if (this.config.colorIcons) {
                    symbolCell.className += " red";
                }
            row.appendChild(symbolCell);

            var descCell = document.createElement("td");
            descCell.innerHTML = "Nothing coming soon...";
            descCell.className = "align-left bright";
            row.appendChild(descCell);
        } else {
            for (let station of this.stationData) {
                var row = document.createElement("tr");
                table.appendChild(row);
                              
                descCell.className = "align-left bright";
                row.appendChild(descCell);

                // number available
                if (true) {
                    var arrTimeCell = document.createElement("td");
		    arrTimeCell.innerHTML = station.num_bikes_available
                    row.appendChild(arrTimeCell);
                }
            }

            var startingPoint = this.stationData.length * this.config.fadePoint;
            var steps = this.stationData.length - startingPoint;
            for (let i = 0; i < this.stationData.length; i++) {
                // Stolen from default modules to ensure style is identical. Thanks MichMich <3
                if (this.config.fade && this.config.fadePoint < 1) {
                    if (i >= startingPoint) {
                        var currentStep = i - startingPoint;
                        table.rows[i].style.opacity = 1 - (1 / steps * currentStep);
                    }
                }
            }
        };

        wrapper.appendChild(table);

        // Don't start the update loop on first init
        if (this.loaded) {
            this.scheduleUpdate();
        }
    },

    notificationReceived: function(notification) {
        if (notification === "DOM_OBJECTS_CREATED") {
            Log.log(this.name + " received a system notification: " + notification);
            this.fetchData();
        }
    },

    scheduleUpdate: function(amt) {
        var interval = amt || this.config.updateInterval;
        var self = this;
        setTimeout(function() {
            self.fetchData();
	}
	, interval * 1000);
    },

    // params: updateDomAfter: boolean, whether or not to call updateDom() after processing data.
    getJSON: function(url, callback) {
	var MBTARequest = new XMLHttpRequest();
        MBTARequest.open('GET', url, true);
        MBTARequest.responseType = 'json';
      	MBTARequest.onload = function() {
	    var status = MBTARequest.status;
	    if (status === 200) {
		callback(null, MBTARequest.response);
	    } else {
		callback(status, MBTARequest.response);
	    }
	};
        MBTARequest.send();
    },

    fetchData: function() {    
	getJSON(this.url,
		function(err, data) {
		    if (err !== null){
    			alert('something went wrong');
		    } else {
			for (let station in this.getStations) {
			    this.stationData.push(data.data.stations[station])
			}
		    }
		this.loaded = true
		});
    },
});
