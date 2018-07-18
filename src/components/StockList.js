import React, { Component } from 'react';
import ApiRequest from '../Util/Api.js';
import './StockList.css';
class StockList extends Component {
	constructor(props) {
		super(props);
		this.state= {
			stockList : ['AAPL', 'INTC', 'NFLX', 'ORCL', 'CMCSA', 'LUV', 'AMZN', 'HOG'],
			selectedStock: null
		};
		this.showChart = this.showChart.bind(this);
	}
	componentWillMount() {
		if (sessionStorage.getItem('active')) {
			this.showChart(sessionStorage.getItem('active'))
		}	
	}
	showChart(selectedStock) {
		this.setState({
			selectedStock
		});
		sessionStorage.setItem('active', selectedStock);
		var arr =[];
		ApiRequest(selectedStock).then((res)=>{
			for (var key in res['Time Series (Daily)']){
				arr.push(res['Time Series (Daily)'][key]['2. high'])
				arr.push(res['Time Series (Daily)'][key]['3. low'])
			}
			arr.sort();
			this.drawChart(arr[0], arr[arr.length-1], res['Time Series (Daily)']);
		}).catch((err)=>{
			alert(err);
		});

	}
	range (start, end, step = 1) {
	  	const len = Math.floor((end - start) / step) + 1
	  	return Array(len).fill().map((_, idx) => start + (idx * step))
	}
	createYAxis(ctx,steps, height) { // Display Text on Y Axis
		var index = height;
		ctx.save();
		ctx.transform(1, 0, 0, -1, 0, height);
		steps.forEach((element) => {
  			ctx.beginPath();
			ctx.moveTo(15,index);
			ctx.lineTo(10,index);
			ctx.stroke();
			ctx.font="8px Verdana";
			ctx.fillText(element,10,index);
			index -= height/10;
			
		});
		ctx.restore();
		
	}
	drawChart(min, max, obj) {
		var index = 30;
		var sticksWidth = 8;
		var myCanvas = document.getElementById("myCanvas");
		var ctx = myCanvas.getContext("2d");
		ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
		var diff = Math.ceil(max)-Math.floor(min);
		var yAxis = diff/10;
		var steps = this.range(Math.floor(min), Math.ceil(max), yAxis);

		ctx.strokeStyle = "#333";
		ctx.lineWidth = 1;
		this.createYAxis(ctx, steps, myCanvas.height);
		ctx.beginPath();
		ctx.moveTo(10,myCanvas.height);
		ctx.lineTo(10,0);
		ctx.lineTo(myCanvas.width, 0)
		ctx.stroke();
		for (var key in obj) {
			let open = (myCanvas.height - 1) * (obj[key]['1. open'] - min) / (max - min) + 1;
			let high = (myCanvas.height - 1) * (obj[key]['2. high'] - min) / (max - min) + 1;
			let low = (myCanvas.height - 1) * (obj[key]['3. low'] - min) / (max - min) + 1;
			let close = (myCanvas.height - 1) * (obj[key]['4. close'] - min) / (max - min) + 1;
			if (open<=close) {
				ctx.strokeStyle = "green";
			} else {
				ctx.strokeStyle = "red";
			}
			ctx.lineWidth = 0.5;
			ctx.beginPath();
			ctx.moveTo(index,low);
			ctx.lineTo(index+sticksWidth/2,low);
			ctx.lineTo(index+sticksWidth/2,high);
			ctx.lineTo(index,high);
			ctx.closePath();
			ctx.stroke();
			 
			//draw the wick
			ctx.lineWidth = 0.5;
			ctx.beginPath();
			ctx.moveTo(index+sticksWidth/2,close);
			ctx.lineTo(index+sticksWidth,close);
			ctx.closePath();
			ctx.stroke();
			
			ctx.lineWidth = 0.5;
			ctx.beginPath();
			ctx.moveTo(index-sticksWidth/2,open);
			ctx.lineTo(index,open);
			ctx.closePath();
			ctx.stroke();
			ctx.strokeStyle = "#ccc";
			ctx.lineWidth = 0.2;
			ctx.moveTo(index+(sticksWidth/4),0);
			ctx.lineTo(index+(sticksWidth/4),myCanvas.height);
			ctx.closePath();
			ctx.stroke();

			index += 10
		}
	}

	render() {
		return (
			<section className="body">
               	<div className="listView">
                   	<ul >
                       	{
                       		this.state.stockList.map((stock, index)=>{
                       			return <StockItem 
                       						key={index}
                       						stock = {stock}
                       						showChart={this.showChart}
                       						activeStock = {this.state.selectedStock === stock}
                       					/>
                       		})
                       	}
                   	</ul>
               	</div>
               	<div className="chartView">
               		<div>
               			<canvas id="myCanvas" width="1100" height="400">
               			</canvas>
               			<span>Data for each day</span>
               		</div>
               	</div>
           	</section>
		);
	}
}

class StockItem extends Component {
	constructor(props) {
		super(props);
		this.clickItem = this.clickItem.bind(this);
	}
	clickItem() {
		this.props.showChart(this.props.stock)
	}
	render() {
		return (
			<li onClick={this.clickItem} className={this.props.activeStock ? "list-item active" : "list-item"}>
				<span>{this.props.stock}</span>
			</li>
		);
	}
}

export default StockList;