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
		$resizingElement: $(window),
		$diagonalElement: $(window),
		startingSizeIsBaseSize: true,
		baseWidth: 800,
		baseHeight: 600,
		minFontSize: 0,
		baseFontSize: 10
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
			$debugFontSize;

		if (settings.debug)
			$elems.css('border', 'dotted 1px #f00');

		// If startingSizeIsBaseSize is enabled then override the baseWidth and baseHeight with the width and height of $resizingElem.
		if (settings.startingSizeIsBaseSize) {
			settings.baseWidth = settings.$resizingElement.width();
			settings.baseHeight = settings.$resizingElement.height();
		}

		// Iterate over all dynamic text elements and set the baseFontSize to be used when calculating size adjustments.
		$elems.css('overflow', 'hidden');

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
					fontSize: '12px',
					zIndex: 999999999
				})
				.prependTo('body');

			$debugDiagonal = $('<div>Diagonal: 0% changed.</div>').appendTo($debug);
			$debugBaseFontSize = $('<div>Base Font Size: 0px</div>').appendTo($debug);
			$debugFontSize = $('<div>Calculated Font Size: 0px</div>').appendTo($debug);
		}

		// On resize of box also resize font.
		settings.$resizingElement.resize(sizeText).resize(); // Manually invoke resize when plugin is loaded for the first time.

		function sizeText() {
			// Declare resize-event-level variables.
			var origDiagonal = Math.sqrt(Math.pow(settings.baseWidth, 2) + Math.pow(settings.baseHeight, 2)),
				newDiagonal = Math.sqrt(Math.pow(settings.$diagonalElement.width(), 2) + Math.pow(settings.$diagonalElement.height(), 2)),
				totalPercentage = (newDiagonal - origDiagonal) / newDiagonal;


			// Iterate over all dynamic text elements and calculate new font size based on $resizingElem totalPercentage change.
			$elems.each(function () {
				var elem = this,
					$elem = $(elem),
					baseFontSize = $elem.data('baseFontSize'),
					// Increase/decrease font size by the percentage.
					newFontSize = settings.baseFontSize + (settings.baseFontSize * totalPercentage);

				// Don't let font size go below the specified minimum.
				if (newFontSize < settings.minFontSize) {
					newFontSize = settings.minFontSize;
					$elem.css('overflow', 'auto');
				}

				// Set the new font size;        
				$elem.css('font-size', newFontSize + 'px');

				// If debug is enabled show values in debug area while resizing.
				if (settings.debug) {
					$debugDiagonal.text('Diagonal: ' + Math.round(totalPercentage * 100) + '% changed.');
					$debugBaseFontSize.text('Base Font Size: ' + settings.baseFontSize);
					$debugFontSize.text('Calculated Font Size: ' + newFontSize);
				}
			});
		}
	};
})(jQuery);