<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [Gallery](#gallery)
    -   [propTypes](#proptypes)

## Gallery

[src/components/Gallery.js:46-99](https://github.com/m860/react-component-image-gallery/blob/90b68c1c911f56b3326f6927be6c190ae59d5db8/src/components/Gallery.js#L46-L99 "Source code on GitHub")

**Extends PureComponent**

Gallery - 画廊,支持缩放,支持marker

组件缩放/移动/marker的特性是通过renderItem来实现的,因此请不要对renderItem方法进行重写.

**Parameters**

-   `props`  

**Examples**

```javascript
import Gallery from 'react-component-image-gallery'

class GalleryDemo extends Component {
    render() {
        return (
            <Gallery
	               showPlayButton={false}
				   showNav={false}
				   showThumbnails={false}
				   showFullscreenButton={false}
				   useBrowserFullscreen={false}
				   items={[{
						original:require('./asset/2.jpg'),
						markers:[
							{
								source:require('./asset/floor.png'),
								style:{width:"20px",height:"20px"},
								x:10,
								y:10,
								onClick:()=>{
									alert('click')
								}
							}
						]
					},
					{original:require('./asset/3.jpg')},
					{original:require('./asset/4.jpg')}
				]}/>
		);
	}
}
```

### propTypes

[src/components/Gallery.js:58-68](https://github.com/m860/react-component-image-gallery/blob/90b68c1c911f56b3326f6927be6c190ae59d5db8/src/components/Gallery.js#L58-L68 "Source code on GitHub")

[...react-image-gallery.props ](https://github.com/xiaolin/react-image-gallery#props)

**Properties**

-   `style` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** 
-   `className` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
-   `minScale` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** [1] - 最小缩放
-   `maxScale` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** [3] - 最大缩放
-   `itemOptions` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** 
    -   `itemOptions.style` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)?** 
    -   `itemOptions.className` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)?** 
    -   `itemOptions.scaleRate` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)?** [100] - 缩放比率
