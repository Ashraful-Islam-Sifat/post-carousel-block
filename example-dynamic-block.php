<?php
/**
 * Plugin Name:       Example Dynamic Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       example-dynamic-block
 *
 * @package Wpdev
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

function render_swipper($attributes) {

  $args = array(
		'posts_per_page' => 5,
		'post_status' => 'publish',
		'order' => 'desc',
		'orderBy' => 'date'
	);

  $recent_posts = get_posts( $args );

	ob_start();
?>

  
<div <?php echo get_block_wrapper_attributes(); ?>>
<div class="swiper mySwiper">
    <div class="swiper-wrapper">
      <?php
      foreach ($recent_posts as $post) {
          $title = get_the_title($post);
          $title = $title ? $title : __('(No title)', 'latest-posts');
          $permalink = get_permalink($post);
          $excerpt = get_the_excerpt($post);
          ?>
          <div class="swiper-slide">
              <div class="edb-post-carousel">
                <?php if ( $attributes['displayFeaturedImage'] && has_post_thumbnail($post)): ?>
                    <div class="post-thumbnail">
                        <?php echo get_the_post_thumbnail($post, 'thumbnail'); // Use 'medium' size ?>
                    </div>
                <?php endif; ?>
                  <h4><a href="<?php echo $permalink; ?>"><?php echo $title; ?></a></h4>
                  <time datetime="<?php echo esc_attr( get_the_date( 'c', $post ) ) ?>"><?php echo esc_html( get_the_date( '', $post ) ) ?></time>
                  <p><?php echo $excerpt; ?></p>
              </div>
          </div>
          <?php
      }
      ?>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-pagination"></div>
</div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
      var swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: <?php echo $attributes['carouselAutoplay'] ? json_encode(array(
            'delay' => 2500,
            'disableOnInteraction' => false
        )) : 'false'; ?>,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        loop: <?php echo json_encode($attributes['carouselInfiniteLoop']); ?>
      });
    });
  </script>
<?php
return ob_get_clean();
	
}


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function wpdev_example_dynamic_block_block_init() {
	wp_register_script( 'swiperjs', plugin_dir_url( __FILE__ ) . 'assets/js/swiper-bundle.min.js',['jquery'], '1.0', true);
	wp_register_style( 'swiperCss', plugin_dir_url( __FILE__ ) . 'assets/css/swiper-bundle.min.css', [], '1.0', 'all');
  wp_register_style('customSwiperStyles', plugin_dir_url(__FILE__) . 'assets/css/custom-swiper-styles.css', [], '1.0', 'all');

	register_block_type( __DIR__ . '/build', array(
		'render_callback'=> 'render_swipper',
		'script'=> array('swiperjs'),
		'style'=> array('swiperCss', 'customSwiperStyles')
	) );
}
add_action( 'init', 'wpdev_example_dynamic_block_block_init' );
