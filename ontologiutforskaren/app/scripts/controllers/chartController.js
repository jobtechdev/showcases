
var kompetensutforskarenApp2 = angular.module('kompetensutforskarenApp');


kompetensutforskarenApp2.controller("ChartCtrl", function ($scope) {


  // angular.module("google-chart-sample", ["googlechart", "googlechart-docs"])
  //   .controller("ChartCtrl", function ($scope) {
    $scope.myChartObject = {};

    $scope.myChartObject.type = "PieChart";

    $scope.onions = [
      {v: "Onions"},
      {v: 3},
    ];

    $scope.myChartObject.data = {"cols": [
      {id: "t", label: "Topping", type: "string"},
      {id: "s", label: "Slices", type: "number"}
    ], "rows": [
      {c: [
        {v: "Mushrooms"},
        {v: 3},
      ]},
      {c: $scope.onions},
      {c: [
        {v: "Olives"},
        {v: 31}
      ]},
      {c: [
        {v: "Zucchini"},
        {v: 1},
      ]},
      {c: [
        {v: "Pepperoni"},
        {v: 2},
      ]}
    ]};

    $scope.myChartObject.options = {
      'title': 'How Much Pizza I Ate Last Night'
    };
  });
