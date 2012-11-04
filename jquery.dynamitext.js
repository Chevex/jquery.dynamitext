(function ($) {
	// Default Options:
	//
	//                  debug - If true, shows a window in the top left of the page showing some stats.
	//        resizingElement - The element to attach the resize event handler to.
	//              baseWidth - The base width for performing percentage change calculations.
	//             baseHeight - The base height for performing percentage change calculations.
	// startingSizeIsBaseSize - If true, overrides baseWidth and baseHeight with the starting width and height of the resizingElement.
	//            minFontSize - The minimum font size that dynamitext should use.
	//
	var defaultOptions = {
		debug: false,
		resizingElement: window,
		startingSizeIsBaseSize: true,
		baseWidth: 1280,
		baseHeight: 1024,
		minFontSize: 0
	};

	// Plugin main entry point.
	$.fn.dynamitext = function (options) {

		// Override default options with any passed in options.
		var settings = $.extend({}, defaultOptions, options);

		// Declare plugin scoped variables.
		var $elems = this,
			$debug,
			$debugWidth,
			$debugHeight,
			$resizingElem = $(settings.resizingElement);
            
        if (settings.debug)
            $elems.css('border', 'dotted 1px #f00');

		// If startingSizeIsBaseSize is enabled then override the baseWidth and baseHeight with the width and height of $resizingElem.
		if (settings.startingSizeIsBaseSize) {
			settings.baseWidth = $resizingElem.width();
			settings.baseHeight = $resizingElem.height();
		}
		
		// Iterate over all dynamic text elements and set the baseFontSize to be used when calculating size adjustments.
		$elems.each(function () {
			var $elem = $(this);
			$elem
				.data('baseFontSize', parseInt($elem.css('font-size')))
				.css('overflow', 'hidden');
		});

		// If debug is enabled then show debug window.
		if (settings.debug) {
			$debug = $('<div>')
				.css({
					position: 'absolute',
					padding: '10px',
					top: '0',
					left: '0',
					background: '#f00',
					color: '#fff',
					fontSize: '12px'
				})
				.prependTo('body');
			
			$debugWidth = $('<div>Width: 0% changed.</div>').appendTo($debug);
			$debugHeight = $('<div>Height: 0% changed.</div>').appendTo($debug);
		}

		// On resize of box also resize font.
		$resizingElem.resize(function () {

			// Declare resize-event-level variables.
			var newWidth = $resizingElem.width(),
				newHeight = $resizingElem.height(),
				percentageWidthDifference = ((newWidth - settings.baseWidth) / newWidth),
				percentageHeightDifference = ((newHeight - settings.baseHeight) / newHeight),
				totalPercentage = (percentageWidthDifference + percentageHeightDifference);

			// Iterate over all dynamic text elements and calculate new font size based on $resizingElem totalPercentage change.
			$elems.each(function () {
				var elem = this,
					$elem = $(elem),
					baseFontSize = $elem.data('baseFontSize'),

					// Increase/decrease font size by the percentage.
					newFontSize = baseFontSize + (baseFontSize * totalPercentage);

				// Don't let font size go below the specified minimum.
				if (newFontSize < settings.minFontSize) {
					newFontSize = settings.minFontSize;
					$elem.css('overflow', 'auto');
				}

				// Set the new font size;        
				$elem.css('font-size', newFontSize + 'px');

				// Check if text is overflowing and decrease font by 1 until overflow is no longer occuring.
				if (newFontSize > settings.minFontSize) {
					while (elem.offsetHeight < elem.scrollHeight || elem.offsetWidth < elem.scrollWidth) {
						newFontSize -= 1;
						$elem.css('font-size', newFontSize + 'px');
					}
				}
			});

			// If debug is enabled show values in debug area while resizing.
			if (settings.debug) {
				$debugWidth.text('Width: ' + Math.round(percentageWidthDifference * 100) + '% changed.');
				$debugHeight.text('Height: ' + Math.round(percentageHeightDifference * 100) + '% changed.');
			}

		}).resize(); // Manually invoke resize when plugin is loaded for the first time.
	};
})(jQuery);