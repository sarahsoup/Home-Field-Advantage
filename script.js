//append <svg> element and implement the margin convention

var m = {t:10,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t +')');

//scale
var scaleX = d3.scaleTime()
    .range([0,w]);
var scaleY = d3.scaleLinear()
    .domain([0,450])
    .range([h,0]); //range controls height of g within svg element

//axis
var axisX = d3.axisBottom()
    .scale(scaleX)
    .ticks(d3.timeYear.every(4))
    .tickSize(0);
var axisY = d3.axisLeft()
    .scale(scaleY)
    .tickSize(0);

d3.select('#country-name')
  .style('left', (w/3) + 'px');

//line generator
var lineGenerator = d3.line()
    .x(function(d){return scaleX(new Date(d.key))})
    .y(function(d){return scaleY(d.value)})
    .curve(d3.curveCatmullRom);

var hostCountries = d3.set();

//-----------------------import data and parse-----------------------//
d3.csv ('./data/summer_olympic_medalists.csv',parse,function(err,rows){

  //set domain for x-axis
  scaleX.domain(d3.extent(rows,function(d){return d.year}));

  //sort rows for nesting
  rows.sort(rows.country);
  rows.sort(function(a,b){return a.year - b.year});

  //create nested timeseries arrays
  var countryTimeseries = d3.nest()
    .key(function(d){return d.country})
    .key(function(d){return d.year})
    .rollup(function(d){return d.length})
    .entries(rows);

  //manually add host indicator
  countryTimeseries.forEach(function(country){
    country.host = 0;
    country.values.forEach(function(countryYear){
      if ((countryYear.key == new Date(1896,0,1) && country.key == "GRE") //Greece
      || (countryYear.key == new Date(1900,0,1) && country.key == "FRA") //France
      || (countryYear.key == new Date(1904,0,1) && country.key == "USA") //USA
      || (countryYear.key == new Date(1908,0,1) && country.key == "GBR") //UK
      || (countryYear.key == new Date(1912,0,1) && country.key == "SWE") //Sweden
      || (countryYear.key == new Date(1920,0,1) && country.key == "BEL") //Belgium
      || (countryYear.key == new Date(1924,0,1) && country.key == "FRA") //France
      || (countryYear.key == new Date(1928,0,1) && country.key == "NED") //Netherlands
      || (countryYear.key == new Date(1932,0,1) && country.key == "USA") //USA
      || (countryYear.key == new Date(1936,0,1) && country.key == "GER") //Germany
      || (countryYear.key == new Date(1948,0,1) && country.key == "GBR") //UK
      || (countryYear.key == new Date(1952,0,1) && country.key == "FIN") //Finland
      || (countryYear.key == new Date(1956,0,1) && country.key == "AUS") //Australia
      || (countryYear.key == new Date(1960,0,1) && country.key == "ITA") //Italy
      || (countryYear.key == new Date(1964,0,1) && country.key == "JPN") //Japan
      || (countryYear.key == new Date(1968,0,1) && country.key == "MEX") //Mexico
      || (countryYear.key == new Date(1972,0,1) && country.key == "FRG") //West Germany
      || (countryYear.key == new Date(1976,0,1) && country.key == "CAN") //Canada
      || (countryYear.key == new Date(1980,0,1) && country.key == "URS") //Soviet Union
      || (countryYear.key == new Date(1984,0,1) && country.key == "USA") //USA
      || (countryYear.key == new Date(1988,0,1) && country.key == "KOR") //South Korea
      || (countryYear.key == new Date(1992,0,1) && country.key == "ESP") //Spain
      || (countryYear.key == new Date(1996,0,1) && country.key == "USA") //USA
      || (countryYear.key == new Date(2000,0,1) && country.key == "AUS") //Australia
      || (countryYear.key == new Date(2004,0,1) && country.key == "GRE") //Greece
      || (countryYear.key == new Date(2008,0,1) && country.key == "CHN")) //China
      {
        countryYear.host = 1;
        country.host = 1;
        countryYear.noc = country.key;
        if( !hostCountries.has(country.key) ){
          hostCountries.add(country.key);
        };
      } else {
        countryYear.host = 0;
        countryYear.noc = country.key;
      };
    });
  });

  //manually add host city and full name of host country
  countryTimeseries.forEach(function(country){
    country.values.forEach(function(countryYear){
      if (countryYear.key == new Date(1896,0,1) && country.key == "GRE") //Greece
      {
        countryYear.city = 'Athens';
        countryYear.nocFull = 'Greece';
      }
      else if (countryYear.key == new Date(1900,0,1) && country.key == "FRA") //France
      {
        countryYear.city = 'Paris';
        countryYear.nocFull = 'France';
      }
      else if (countryYear.key == new Date(1904,0,1) && country.key == "USA") //USA
      {
        countryYear.city = 'St. Louis';
        countryYear.nocFull = 'United States';
      }
      else if (countryYear.key == new Date(1908,0,1) && country.key == "GBR") //UK
      {
        countryYear.city = 'London';
        countryYear.nocFull = 'Great Britain';
      }
      else if (countryYear.key == new Date(1912,0,1) && country.key == "SWE") //Sweden
      {
        countryYear.city = 'Stockholm';
        countryYear.nocFull = 'Sweden';
      }
      else if (countryYear.key == new Date(1920,0,1) && country.key == "BEL") //Belgium
      {
        countryYear.city = 'Antwerp';
        countryYear.nocFull = 'Belgium';
      }
      else if (countryYear.key == new Date(1924,0,1) && country.key == "FRA") //France
      {
        countryYear.city = 'Paris';
        countryYear.nocFull = 'France';
      }
      else if (countryYear.key == new Date(1928,0,1) && country.key == "NED") //Netherlands
      {
        countryYear.city = 'Amsterdam';
        countryYear.nocFull = 'Netherlands';
      }
      else if (countryYear.key == new Date(1932,0,1) && country.key == "USA") //USA
      {
        countryYear.city = 'Los Angeles';
        countryYear.nocFull = 'United States';
      }
      else if (countryYear.key == new Date(1936,0,1) && country.key == "GER") //Germany
      {
        countryYear.city = 'Berlin';
        countryYear.nocFull = 'Germany';
      }
      else if (countryYear.key == new Date(1948,0,1) && country.key == "GBR") //UK
      {
        countryYear.city = 'London';
        countryYear.nocFull = 'Great Britain';
      }
      else if (countryYear.key == new Date(1952,0,1) && country.key == "FIN") //Finland
      {
        countryYear.city = 'Helsinki';
        countryYear.nocFull = 'Finland';
      }
      else if (countryYear.key == new Date(1956,0,1) && country.key == "AUS") //Australia
      {
        countryYear.city = 'Melbourne';
        countryYear.nocFull = 'Australia';
      }
      else if (countryYear.key == new Date(1960,0,1) && country.key == "ITA") //Italy
      {
        countryYear.city = 'Rome';
        countryYear.nocFull = 'Italy';
      }
      else if (countryYear.key == new Date(1964,0,1) && country.key == "JPN") //Japan
      {
        countryYear.city = 'Tokyo';
        countryYear.nocFull = 'Japan';
      }
      else if (countryYear.key == new Date(1968,0,1) && country.key == "MEX") //Mexico
      {
        countryYear.city = 'Mexico City';
        countryYear.nocFull = 'Mexico';
      }
      else if (countryYear.key == new Date(1972,0,1) && country.key == "FRG") //West Germany
      {
        countryYear.city = 'Munich';
        countryYear.nocFull = 'West Germany';
      }
      else if (countryYear.key == new Date(1976,0,1) && country.key == "CAN") //Canada
      {
        countryYear.city = 'Montreal';
        countryYear.nocFull = 'Canada';
      }
      else if (countryYear.key == new Date(1980,0,1) && country.key == "URS") //Soviet Union
      {
        countryYear.city = 'Moscow';
        countryYear.nocFull = 'Soviet Union';
      }
      else if (countryYear.key == new Date(1984,0,1) && country.key == "USA") //USA
      {
        countryYear.city = 'Los Angeles';
        countryYear.nocFull = 'United States';
      }
      else if (countryYear.key == new Date(1988,0,1) && country.key == "KOR") //South Korea
      {
        countryYear.city = 'Seoul';
        countryYear.nocFull = 'South Korea';
      }
      else if (countryYear.key == new Date(1992,0,1) && country.key == "ESP") //Spain
      {
        countryYear.city = 'Barcelona';
        countryYear.nocFull = 'Spain';
      }
      else if (countryYear.key == new Date(1996,0,1) && country.key == "USA") //USA
      {
        countryYear.city = 'Atlanta';
        countryYear.nocFull = 'United States';
      }
      else if (countryYear.key == new Date(2000,0,1) && country.key == "AUS") //Australia
      {
        countryYear.city = 'Sydney';
        countryYear.nocFull = 'Australia';
      }
      else if (countryYear.key == new Date(2004,0,1) && country.key == "GRE") //Greece
      {
        countryYear.city = 'Athens';
        countryYear.nocFull = 'Greece';
      }
      else if (countryYear.key == new Date(2008,0,1) && country.key == "CHN") //China
      {
        countryYear.city = 'Beijing';
        countryYear.nocFull = 'China';
      }
    });
  });

  //-----------------------add buttons-----------------------//
  d3.select('.btn-default')
      .selectAll('.btn')
      .data( hostCountries.values().sort() )
      .enter()
      .append('a')
      .html(function(d){return d})
      .attr('class','btn btn-default')
      .style('color','#B6BDB8')
      .style('background','#3F3F3F')
      .style('border-color','#323232')
      .on('click',function(d){
        d3.selectAll('.btn')
          .style('background','#3F3F3F')
          .style('border-color','#323232')
          .style('color','#B6BDB8');
        d3.select(this).style('background','#009F93')
          .style('border-color','#009F93')
          .style('color','#323232');
        var hostYears = d3.set();
        var t = 1000;
        //set path attributes
        d3.selectAll('.countryPath')
          .transition().duration(t)
          .style('stroke', function(d,i){ return hostMatch(d,i) ? '#009F93' : '#ebf5ee';})
          .style('opacity', function(d,i){ return hostMatch(d,i) ? 1 : .03; });

          function hostMatch(data,value){
            var isMatched = false;
            data.forEach(function(country){
              if (d == country.noc) {isMatched = true};
              if (d == country.noc && country.host == 1) {hostYears.add(country.key)};
            });
            return isMatched;
          };

        //set node attributes
        d3.selectAll('.node')
          .transition().duration(t)
          .style('fill',function(e){
            if(hostYears.has(e.key)) {return '#ff6978'}
            else {return '#ebf5ee'}
          })
          .style('fill-opacity', function(e){
            if(hostYears.has(e.key)) {return 0.4}
            else {return 0.2}
          });

        //set label attributes
        d3.selectAll('.labels-city')
        .attr('x',function(e){
            if(d == e.noc && e.host == 1){return scaleX(new Date(e.key))}
            else {return null}
        })
        .attr('y',function(e){
            if(d == e.noc && e.host == 1){return scaleY(-40)}
            else {return null}
        })
        .attr('text-anchor','middle')
        .transition().duration(t)
        .style('fill',function(e){
            if(d == e.noc && e.host == 1){return '#ff6978'}
            else {return '#323232'}
        })
        .style('fill-opacity',function(e){
          if(d == e.noc && e.host == 1){return 1}
          else {return 0}
        })
        .style('font-size','14px')
        .style('font-weight','lighter')
        .text(function(e){
            if(d == e.noc && e.host == 1){return e.city}
            else {return null}
        });

        //set x-axis attributes
        gx.selectAll('text')
        .transition().duration(t)
        .style('fill',function(e){
          if(hostYears.has(e)) {return '#ff6978'}
          else {return '#ebf5ee'}
        });

        d3.select('#country-name')
        .transition().duration(t)
        .text(function(){
          if(d == "GRE"){return "Greece"}
          else if(d == "FRA"){return "France"}
          else if(d == "USA"){return "United States"}
          else if(d == "GBR"){return "Great Britain"}
          else if(d == "SWE"){return "Sweden"}
          else if(d == "BEL"){return "Belgium"}
          else if(d == "NED"){return "Netherlands"}
          else if(d == "GER"){return "Germany"}
          else if(d == "FIN"){return "Finland"}
          else if(d == "AUS"){return "Australia"}
          else if(d == "ITA"){return "Italy"}
          else if(d == "JPN"){return "Japan"}
          else if(d == "MEX"){return "Mexico"}
          else if(d == "FRG"){return "West Germany"}
          else if(d == "CAN"){return "Canada"}
          else if(d == "URS"){return "Soviet Union"}
          else if(d == "KOR"){return "South Korea"}
          else if(d == "ESP"){return "Spain"}
          else if(d == "CHN"){return "China"}
          })
        .style('font-size','24px')
        .style('color','#009F93');
        });

  draw(countryTimeseries);

  //Draw axis
  var gx = plot.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+ (h+10) +')') //scaleY height h
    .call(axisX);
  var gy = plot.append('g').attr('class','axis axis-y')
    .attr('transform','translate('+ (-10) +',0)')
    .call(axisY);
  plot.append('text')
    .attr('text-anchor','middle')
    .attr('transform', 'translate('+ (-40)+','+(h/2)+')rotate(-90)')
    .text('Medal Count')
    .style('fill','#ebf5ee')
    .attr('font-size','10px');

});

//-----------------------draw timeseries-----------------------//
function draw(timeseries){
  //create g element for each country
  var countries = plot.selectAll('.country')
    .data(timeseries)
    .enter()
    .append('g').attr('class','country');

  //append path per country
  countries.append('path')
    .datum(function(d){return d.values})
    .attr('class','countryPath')
    .attr('d',function(array){
      return lineGenerator(array);
    })
    .style('stroke-width','2px')
    .style('stroke','#ebf5ee')
    .style('fill','none')
    .style('opacity',.1)
    .style('opacity',.1);

  //append circles per year per country
  countries.selectAll('.node')
    .data(function(d){return d.values})
    .enter()
    .append('circle')
    .attr('class','node')
    .attr('r',4)
    .attr('cx',function(d){return scaleX(new Date(d.key))})
    .attr('cy',function(d){return scaleY(d.value)})
    .style('fill-opacity',function(d){
      if (d.host == 1){return .2}
      else {return .2}
    })
    .style('fill',function(d){
      return '#ebf5ee'
    })
    .on('mouseenter',function(d){
        var tooltip = d3.select('.custom-tooltip');
        tooltip.select('.title')
            .html(d.noc)
            .style('font-size','12px')
            .style('font-weight','lighter')
        tooltip.select('.value')
            .html(d.value + ' medals')
            .style('font-size','12px')
            .style('font-weight','lighter');
        tooltip.transition().style('opacity',1);
    })
    .on('mousemove',function(d){
        var tooltip = d3.select('.custom-tooltip');
        var xy = d3.mouse( d3.select('.container').node() );
        tooltip
            .style('left',xy[0]+10+'px')
            .style('top',xy[1]+(-35)+'px');
    })
    .on('mouseleave',function(d){
        var tooltip = d3.select('.custom-tooltip');
        tooltip.transition().style('opacity',0);
        d3.select(this).style('stroke-width','0px');
    });

    countries.selectAll('.labels-count')
    .data(function(d){return d.values})
    .enter()
    .append('text')
    .attr('class','labels-count');

    countries.selectAll('.labels-city')
    .data(function(d){return d.values})
    .enter()
    .append('text')
    .attr('class','labels-city');
};

//-----------------------parse function-----------------------//

function parse(d){
  return {
    year: new Date(+d.Edition,0,1),
    country: d.NOC,
    medal: d.Medal
  };
};
