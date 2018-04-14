'use strict';

/**
 * @ngdoc function
 * @name kompetensutforskarenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the kompetensutforskarenApp
 */
var kompetensutforskarenApp = angular.module('kompetensutforskarenApp');


kompetensutforskarenApp.controller('MainCtrl', function ($scope, $log, $http) {

  $log.info('MainCtrl initialized');
  $scope.input = {};
  $scope.relationsobj = {};

  $scope.tags = [];
  $scope.typechoicearea = {type:'Kompetens'};

  function getQueryParameterByName(name, url) {
    if (!url) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) {return '';}
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  $scope.isshowkompetenskarta = (getQueryParameterByName('kompetenskarta') === 'true');

  $scope.loadTags = function (query) {
    return $http.get('/tags?query=' + query);
  };


  $scope.searchConcepts = function (val) {

    $scope.input.val = val;

    var term = val;
    var nrOfSuggestions = 5;
    var request = {
      method: 'GET',
      url: ONTOLOGY_APIURL + '/terms?filter=' + encodeURIComponent(term),
      headers: {'Content-Type': 'application/json'}
    };

    // $scope.koncepturl = request.url;

    return $http(request)
      .then(function (response) {
        var rows = response.data;

        function processrow(row) {
          var type = ''
          if(row.type === 'occupation') {
            type = 'yrke';
          } else if(row.type === 'skill') {
            type = 'kompetens';
          } else if(row.type === 'trait') {
            type = 'förmåga';
          }


          return {

            'term': row.name,
            'displayname': row.name + '  (' + type + ')',
            'id': '0'
          };
        }

        var competences = _.map(rows, processrow);
        return competences;

      });
  };

  $scope.typetextFormat = function () {
      if($scope.typechoicearea.type === 'Kompetens'){
        return 'Kompetenser';
      }
      if($scope.typechoicearea.type === 'Förmåga'){
        return 'Förmågor';
      }
      if($scope.typechoicearea.type === 'Yrke'){
        return 'Yrken';
      }
  };

  $scope.onTypeaheadSelect = function ($item, $tags, tags) {
    $scope.findRelated(tags);
  };

  $scope.clickbutton = function (tags) {
    $log.info($scope.tags);
  };


  $scope.kkChartObject = {};
  $scope.kkChartObject.type = 'PieChart';
  $scope.kkChartObject.options = {
    'title': 'Kompetenskarta',
    'is3D':true
    // 'pieHole': 0.4
  };



  $scope.updateChart = function(chartdata) {

    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Kategori');
    data.addColumn('number', 'Andel');
    data.addColumn({type:'string', role:'tooltip'});
    data.addRows(chartdata);

    $scope.kkChartObject.data = data;
  };


  $scope.showkompetenskarta = function() {
    var numrows = 0;
    if($scope.kkChartObject.data !== undefined && $scope.kkChartObject.data.Nf !== undefined) {
       numrows = $scope.kkChartObject.data.Nf.length;
    }
    return $scope.isshowkompetenskarta && $scope.typechoicearea.type === 'Förmåga' && numrows > 0;
  };


  $scope.findRelatedFromResult = function (term, type) {
    window.scrollTo(0, 0);
    $scope.relationsobj = {};


    var newTag = {'term': term, 'displayname': term, 'id': '0'};
    $scope.tags.push(newTag);

    $scope.input.termer = term;
    $scope.findRelated($scope.tags);
  };



  $scope.findRelated = function (model) {
    $scope.updateChart([]);
    // $log.info($scope.tags);
    var typ = '';
    if($scope.typechoicearea.type === 'Kompetens') {
      typ = 'skill';
    } else if($scope.typechoicearea.type === 'Yrke') {
      typ = 'occupation';
    }else if($scope.typechoicearea.type === 'Förmåga') {
      typ = 'trait';
    }


    var concept = '';
    for (var term in model) {
      concept += 'concept=' + encodeURIComponent(model[term].term) + '&';
    }

    $scope.resulterrormessage = '';

    // http://sauron.ws.ams.se:6010/kompetenskartan/v1/mapdata/?concept=snickare

    var kkrequest = {
      method: 'GET',
      url: KOMPETENSKARTAN_APIURL + '/mapdata/?' + concept,
      headers: {'Content-Type': 'application/json'}
    };

    if(model.length > 0) {
      $http(kkrequest)
        .then(function (response) {
          var data = response.data;

          var chartdata = [];

          data.resultrows.forEach(function (element) {
            var dataitem = element;
            var label = Object.keys(dataitem)[0];
            var value = Object.values(dataitem)[0];
            var percent = value;
            var percentTooltip = (value * 100).toFixed(1);
            $log.info('percent: ' + percent + ', percentTooltip: ' + percentTooltip)

            chartdata.push([label, percent, percentTooltip + '%']);
          });
          $scope.updateChart(chartdata);

        });
    }



    var request = {
      method: 'GET',
      url: ONTOLOGY_APIURL + '/concept/related?' + concept + 'limit=20&type=' + typ,
      headers: {'Content-Type': 'application/json'}
    };

    // $scope.relatedurl = request.url;

    return $http(request)
      .then(function (response) {
        var data = response.data;
        $scope.relationsobj.resultTerm = data.name;
        $scope.relationsobj.resultUuid = data.uuid;
        $scope.relationsobj.relationsCount = data.count;
        $scope.relationsobj.relations = data.relations;


        $log.info('call completed');

      }, function (response) {

        $scope.relationsobj = {};
        // $scope.data = response.data || 'Request failed';
        // $scope.status = response.status;
        //$scope.resulterrormessage = response.data || 'Request failed';
        if (response.status === 404) {
          $scope.resulterrormessage = 'Kunde inte hitta kompetensen ' + term;
        } else {
          $scope.resulterrormessage = 'Tekniskt fel. Response.status:' + response.status;
        }

      });

  };


});



