let width = 960;
let height = 720;

let projection = d3.geoMercator()
.scale(470)    	
.translate([width / 3, height / 1.8]);

let path = d3.geoPath()
.projection(projection);

function createMap(error, africa) {
if (error) throw error;
afroData=topojson.feature(africa, africa.objects.collection).features;

afroData2=topojson.feature(africa, africa.objects.collection);

let dimObj={
  "Life expectancy at birth (years)":"life_expectancy",
  "Mortality rate, infant (per 1000 live-births)":"infant_deaths",
  "Mortality rate, under-5 (per 1000 live-births)":"under5_deaths",
  "Fertility rate, total (births per woman)":"fert",
  "Prevalence of HIV, total (% of population ages 15-49)":"hiv",
  "Incidence of tuberculosis (per 100000 people)":"tub",
  "Population growth (annual %)":"grow"
}
d3.select("#div1").remove();
d3.select("#wrapper").append("div").attr("id","div1");
d3.select("#selectButton1").remove();
d3.select("#div1").append("select").attr("id","selectButton1");
d3.select("#canvas1").remove();

let canvas1 = d3.select("#div1")
.append("svg")
.attr("id","canvas1");
d3.select("#div2").remove();
d3.select("#wrapper").append("div").attr("id","div2");
d3.select("#selectButton2").remove();

d3.select("#div2").append("select").attr("id","selectButton2");

d3.select("#canvas2").remove();

let canvas2 = d3.select("#div2").append("svg").attr("id","canvas2");

let toolTip=d3.select("#tooltip");

let w=+canvas1.style("width").slice(0,-2);

let h=+canvas1.style("height").slice(0,-2);

let pad=w/10;

;

let h2=+canvas2.style("height").slice(0,-2);

let pad2_t=h2/5;

let pad2_b=h2/6;

canvas1.append("g")
.attr("class","continent");

function showMeasures(dim,reg){

let color=d3.scaleSequential().interpolator(d3.interpolateYlOrBr);

if(dim=="Mortality rate, infant (per 1000 live-births)"){

  color=d3.scaleSequential().interpolator(d3.interpolateYlOrRd);

}

if(dim=="Mortality rate, under-5 (per 1000 live-births)"){

  color=d3.scaleSequential().interpolator(d3.interpolateOranges);

}

if(dim=="Fertility rate, total (births per woman)"){

  color=d3.scaleSequential().interpolator(d3.interpolateGreens);

}

  if(dim=="Population growth (annual %)"){

  color=d3.scaleSequential().interpolator(d3.interpolateBlues);
  }

if(dim=="Prevalence of HIV, total (% of population ages 15-49)"){

  color=d3.scaleSequential().interpolator(d3.interpolateReds);

}

color.domain([vals2[dimObj[dim]]["mini"],vals2[dimObj[dim]]["maxi"]]);

if(dimObj[dim]=="hiv"){

  color.domain([0,16]);

}

if(dim=="Incidence of tuberculosis (per 100000 people)"){

  color=d3.scaleSequential().interpolator(d3.interpolatePurples);

}

if(dimObj[dim]=="tub"){

  color.domain([9,550]);

}

if(dim=="Life expectancy at birth (years)"){

  color.domain([vals2[dimObj[dim]]["maxi"],vals2[dimObj[dim]]["mini"]])

}

let p1=d3.select("body").append("p").attr("id","p1").style("opacity",0);

let p2=d3.select("body").append("p").attr("id","p2").style("opacity",0);

let Scale=d3.scaleLinear().domain([vals2[dimObj[dim]]["mini"],vals2[dimObj[dim]]["maxi"]]).range([pad,w-2.2*pad]);	

canvas1.selectAll(".countries")
.data(afroData)
.enter()
.append('path')
.attr("class", "country-border").attr("d", path).style("fill",(cntItem)=>{
let adm0_a3_is=cntItem["properties"]["adm0_a3_is"];
for(let i=0;i<56;i++){
  if(vals[i]["adm0_a3_is"]==adm0_a3_is){
 return color(vals[i][dimObj[dim]]);
  }
}
return "black";}
 ).on('mouseover', (cntItem)=>{

adm0_a3_is=cntItem["properties"]["adm0_a3_is"];

for(let i=0;i<56;i++){

  if(vals[i]["adm0_a3_is"]==adm0_a3_is){
toolTip.html("Country: "+vals[i]["geounit"]+"<br> Capital: "+vals[i]["Capital"]+"<br> Population (2021): "+vals[i]["population"]+"<br>" + dim+" (2021): "+vals[i][dimObj[dim]]);
  }
}          toolTip.style("visibility","visible").style("left",event.pageX+w/60+"px").style("top",event.pageY+h/50+"px").style("background-color","#fff8ed").attr("class","tip").style("border",`1px solid ${color(0.5*(vals2[dimObj[dim]["maxi"]]-vals2[dimObj[dim]["mini"]]))}`).style("font","10px arial")}).on("mouseleave",(cntItem)=>{toolTip.style("visibility","hidden");});

canvas1             .attr('preserveAspectRatio', 'xMinYMin')
.attr('viewBox', '0 0 ' + width + ' ' + height)
.attr('width', null)
.attr('height', null);

let div1=d3.select("#div1");
let div2=d3.select("#div2");	

canvas1.style("border",`1px solid ${color(Math.abs(0.5*(vals2[dimObj[dim]]["maxi"]-vals2[dimObj[dim]]["mini"])))}`);

canvas2.style("border",`1px solid ${color(0.5*(vals2[dimObj[dim]]["maxi"]-vals2[dimObj[dim]]["mini"]))}`);

let years=[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021];

let yScale = d3.scaleBand().domain(years).range([pad2_t,h2-pad2_b]).padding(0);

bw=yScale.bandwidth();

let yAxis=d3.axisLeft(yScale);

canvas2.selectAll("text").remove();

canvas2.selectAll("rect").remove();

canvas2.append("text").attr("x",pad).attr("y",w/18).text(`${dim}:`).style("font",`${12/350*w}px arial`);

  

if((["Egypt","Seychelles","Somalia","Liberia","Mozambique"].indexOf(reg) == -1) || (dimObj[dim]!="hiv")){ 

canvas2.append("text").attr("x",pad).attr("y",w/11).text(`${reg}`).style("font",`${12/350*w}px arial`);

}

if((["Egypt","Seychelles","Somalia","Liberia","Mozambique"].indexOf(reg) > -1) && (dimObj[dim]=="hiv")){ 

canvas2.append("text").attr("x",pad).attr("y",w/11).text(`${reg}*`).style("font",`${12/350*w}px arial`);

  canvas2.append("text").attr("x",pad).attr("y",0.89*h2).text("* due to lack of data replaced by mean value of region").style("font",`${8/350*w}px arial`);

}

if((["Egypt"].indexOf(reg)>-1)&&(dimObj[dim]=="hiv")){

canvas2.append("text").attr("x",pad).attr("y",0.935*h2).text("North: Algeria, Egypt, Libya, Morocco, Tunisia").style("font",`${8/350*w}px arial`);}

if((["Liberia"].indexOf(reg)>-1)&&(dimObj[dim]=="hiv")){

canvas2.append("text").attr("x",pad).attr("y",0.935*h2).text("West:  Benin, Burkina Faso, Chad, Gambia, Guinea, Guinea Bissau, Ivory Coast, Liberia, ").style("font",`${8/350*w}px arial`);

canvas2.append("text").attr("x",pad).attr("y",0.97*h2).text("Mali, Mauritania, Niger, Nigeria, Sierra Leone, Togo, Ghana, Senegal, Cape Verde").style("font",`${8/350*w}px arial`);}

if((["Seychelles","Somalia"].indexOf(reg)>-1)&&(dimObj[dim]=="hiv")){

canvas2.append("text").attr("x",pad).attr("y",0.935*h2).text("East: Burundi, Djibouti, Eritrea, Ethiopia, Somalia, Rwanda, Kenya, Uganda, Tanzania,").style("font",`${8/350*w}px arial`);

canvas2.append("text").attr("x",pad).attr("y",0.97*h2).text("Sudan, South Sudan, Seychelles").style("font",`${8/350*w}px arial`);

}

if((["Mozambique"].indexOf(reg)>-1)&&(dimObj[dim]=="hiv")){

canvas2.append("text").attr("x",pad).attr("y",0.935*h2).text("Southern: Angola, Botswana, Comoros, Eswatini, Lesotho, Madagascar, Malawi, ").style("font",`${8/350*w}px arial`);

canvas2.append("text").attr("x",pad).attr("y",0.97*h2).text("Mozambique, Namibia, South Africa, Zambia, Zimbabwe").style("font",`${8/350*w}px arial`);}

canvas2.append('g').call(yAxis).attr("transform","translate("+pad+",0)").style("font",`${(9/350)*w}px arial`);

let a1=vals2[dimObj[dim]][reg];

for(let i=0;i<11;i++){

if(a1[i]>=0){

canvas2.append("rect").attr("x",pad).attr("y",pad2_t+i*bw).attr("width",Scale(a1[i])).attr("height",0.97*bw).style("fill",color(a1[i]));

canvas2.append("text").attr("x",5*w/350+0.9*pad+Scale(a1[i])).attr("y",pad2_t+w/40+i*bw).text(a1[i]).style("fill","black").style("font",`${(9/350)*w}px arial`);}

if(a1[i]<0){

  canvas2.append("text").attr("x",5*w/350+pad).attr("y",pad2_t+w/40+i*bw).text(a1[i]+": negative growth, most probably due to refugee movements").style("fill","black").style("font",`${(9/350)*w}px arial`);}

}

    let p=(vals2[dimObj[dim]]["maxi"]-vals2[dimObj[dim]]["mini"])/9;

if(dimObj[dim]=="hiv"){

  p=16/9;

}

if(dimObj[dim]=="tub"){

  p=541/9;

}

let l=[]

if(dimObj[dim]!="tub"){

for(let i=0;i<9;i++){

  l.push((vals2[dimObj[dim]]["mini"]+i*p).toFixed(1));

}

}

if(dimObj[dim]=="tub"){

for(let i=0;i<9;i++){

  l.push((vals2[dimObj[dim]]["mini"]+i*p).toFixed(0));

}

  }

canvas1.selectAll("text").remove();

canvas1.selectAll("rect").remove();

for(let i=0;i<9;i++){

canvas1.append("rect").attr("x",140*350/w+i*Math.min(90,w/5.7)).attr("y",770).attr("width",Math.min(90,w/5.7)).attr("height",30).style("fill",color(l[i]));

canvas1.append("text").attr("x",140*350/w+w/50+i*Math.min(90,w/5.7)).attr("y",815).text(l[i]).style("fill","black").style("font",`${(12/350)*w} px arial`);

}

}

  showMeasures("Life expectancy at birth (years)","Democratic Republic of the Congo");

  d3.select("#selectButton1")

      .selectAll('myOptions')

     	.data(['Life expectancy at birth (years)','Mortality rate, infant (per 1000 live-births)','Mortality rate, under-5 (per 1000 live-births)','Fertility rate, total (births per woman)', 'Prevalence of HIV, total (% of population ages 15-49)',

'Incidence of tuberculosis (per 100000 people)','Population growth (annual %)'
 ]).enter()
.append('option')
.text(function (d) { return d; }) .attr("value", function (d) { return d; })

d3.select("#selectButton2")
.selectAll('myOptions')
.data(cntries)
.enter()
.append('option')
.text(function (d) { return d; }) 
.attr("value", function (d) { return d; })
  
function update(sel1,sel2) {   
   showMeasures(sel1,sel2);
}

d3.select("#selectButton1").on("change", function(d) {
let selectedOption = d3.select(this).property("value");
d3.select("#p1").text(selectedOption  );

let v2=document.getElementById('p2').innerText;

if(!v2){
  update(selectedOption,"Democratic Republic of the Congo");
}

else{
update(selectedOption,v2);}
})

d3.select("#selectButton2").on("change", function(d) {
let selectedOption2 = d3.select(this).property("value");

d3.select("#p2").text(selectedOption2);

let v1=document.getElementById('p1').innerText;

if(!v1){
  update("Life expectancy at birth (years)",selectedOption2);
}

else{
update(v1,selectedOption2);
    }
  });
}
d3.queue()   .defer(d3.json,"https://raw.githubusercontent.com/JBreitenbr/Africa-Measures/main/africa.topojson").await(createMap);
