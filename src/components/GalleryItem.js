import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import GalleryMarker from './GalleryMarker'
import {Motion, spring} from 'react-motion'

const actionType = {
	none: 0,
	scaling: 1,
	moving: 2
};

export default class GalleryItem extends PureComponent {
	_actionType: actionType;

	static propTypes = {
		item: PropTypes.object.isRequired,
		minScale: PropTypes.number,
		maxScale: PropTypes.number
	};

	static defaultProps = {
		minScale: 1,
		maxScale: 3
	};


	constructor(props) {
		super(props);
		this._actionType = actionType.none;
		this._touchStart = false;
		this._lastTouches = [];
		this._mounted = false;
		this.state = {
			scale: 1,
			x: 0,
			y: 0,
			width: null,
			height: null,
			imageIsReady: false,
			initialScale: 1,
			originalSize: {
				width: 0,
				height: 0
			}
		};
	}

	_getRealWidth() {
		return this.state.width * this.state.scale;
	}

	_getRealHeight() {
		return this.state.height * this.state.scale;
	}

	_getContainerWidth() {
		const {root}=this.refs;
		if (root) {
			return root.clientWidth;
		}
		return 0;
	}

	_getContainerHeight() {
		const {root}=this.refs;
		if (root) {
			return root.clientHeight;
		}
		return 0;
	}

	_getMovingRegion(scale) {
		const width = this.state.width * scale;
		const height = this.state.height * scale;
		const hw = width / 2;
		const hh = height / 2;
		const containerWidth = this._getContainerWidth();
		const containerHeight = this._getContainerHeight();
		const halfContainerWidth = containerWidth / 2;
		const halfContainerHeight = containerHeight / 2;

		const left = {
			x: hw * -1,
			y: hh * -1
		};
		const diffWidth = Math.abs(left.x + halfContainerWidth);
		const offsetX = diffWidth;
		const diffHeight = Math.abs(left.y + halfContainerHeight);
		const offsetY = diffHeight;
		return {
			left: -offsetX,
			right: offsetX,
			top: -offsetY,
			bottom: offsetY,
		};
	}


	_moving(event) {
		//event.preventDefault();
		//event.stopPropagation();
		const touch = event.targetTouches[0];
		const lastTouch = this._lastTouches[0];
		const diff = {
			x: touch.pageX - lastTouch.pageX,
			y: touch.pageY - lastTouch.pageY
		};
		this._lastTouches = [touch];

		const newState = Object.assign({}, this.state, {
			x: this.state.x + diff.x,
			y: this.state.y + diff.y
		});
		const region = this._getMovingRegion(this.state.scale);
		if (newState.x <= region.right && newState.x >= region.left) {
			event.stopPropagation();
			this.setState(newState);
		}
	}

	_getDistance(touches) {
		const touch1 = touches[0];
		const touch2 = touches[1];
		return Math.sqrt(Math.pow(touch1.pageX - touch2.pageX, 2) + Math.pow(touch1.pageY - touch2.pageY, 2));
	}

	_scale(event) {
		const dis1 = this._getDistance(event.targetTouches);
		const dis2 = this._getDistance(this._lastTouches);
		this._lastTouches = event.targetTouches;

		const diff = dis1 - dis2;
		const scale = diff / 1000;

		const state = Object.assign({}, this.state, {
			scale: this.state.scale + scale,
		});
		this.setState(state);
	}

	_restore(event) {
		let x = this.state.x;
		let y = this.state.y;
		let scale = this.state.scale;
		const region = this._getMovingRegion(this.state.scale);
		if (x > region.right) {
			x = region.right;
		}
		else if (x < region.left) {
			x = region.left;
		}
		if (y < region.top) {
			y = region.top;
		}
		else if (y > region.bottom) {
			y = region.bottom;
		}
		if (scale < this.props.minScale) {
			scale = this.props.minScale;
		}
		else if (scale > this.props.maxScale) {
			scale = this.props.maxScale;
		}
		const state = Object.assign({}, this.state, {x, y, scale});
		this.setState(state);
	}

	reset() {
		if (this._mounted) {
			this.setState(
				Object.assign({}, this.state, {
					x: 0,
					y: 0,
					scale: 1
				})
			)
		}
	}

	render() {
		if (!this.state.imageIsReady) {
			return null;
		}
		const markers = this.props.item.markers || [];
		return (
			<div style={{position:"relative"}} ref="root">
				<Motion
					defaultStyle={{scale:1,x:0,y:0}}
					style={{scale:spring(this.state.scale),x:spring(this.state.x/this.state.scale),y:spring(this.state.y/this.state.scale)}}>
					{({scale, x, y})=> {
						return (
							<img
								style={{transform:`scale(${scale}) translate(${x}px,${y}px)`,transformOrigin:"center center"}}
								onLoad={(event)=>{
									const {target}=event;
									const state=Object.assign({},this.state,{
										width:target.width,
										height:target.height,
										counter:this.state.counter+1,
										initialScale:target.width/this.state.originalSize.width
									});
									this.setState(state);
								}}
								onTouchStart={event=>{
									this._touchStart=true;
									event.persist();
									this._lastTouches=event.targetTouches;
									if(this._lastTouches.length>=2){
										this._actionType=actionType.scaling;
									}
									else{
										this._actionType=actionType.moving;
									}
								}}
								onTouchMove={(event)=>{
									event.preventDefault();
									if(this._touchStart){
										event.persist();
										if(this._actionType===actionType.scaling){
											this._scale(event);
										}
										else{
											this._moving(event);
										}
									}
								}}
								onTouchEnd={event=>{
									this._touchStart=false;
									this._lastTouches=[];
									this._actionType=actionType.none;
									this._restore(event);
								}}
								src={this.props.item.original}/>
						);
					}}
				</Motion>
				{markers.map((marker, index)=> {
					const newX = marker.x * this.state.initialScale * this.state.scale + this.state.x;
					const newY = marker.y * this.state.initialScale * this.state.scale + this.state.y;
					return (
						<GalleryMarker {...marker} key={index} x={newX} y={newY} defaultX={marker.x}
												   defaultY={marker.y}/>
					);
				})}
			</div>
		);
	}

	_loadImageComplete(err, event) {
		const imageOriginalSize = {
			width: event.target.width,
			height: event.target.height
		};
		console.log(`image original size : ${JSON.stringify(imageOriginalSize)}`)
		const state = Object.assign({}, this.state, {
			imageIsReady: true,
			originalSize: imageOriginalSize
		});
		this.setState(state);
	}

	componentDidMount() {
		this._mounted = true;
		let image = new Image();
		image.src = this.props.item.original;
		image.onload = (event)=> {
			this._loadImageComplete(null, event);
		};
		image.onerror = (err)=> {
			this._loadImageComplete(err);
		}
	}

	componentWillUnmount() {
		this._mounted = false;
	}
}
