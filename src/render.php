<!-- 
<?php
	$args = array(
		'posts_per_page' => 5,
		'post_status' => 'publish',
		'order' => 'desc',
		'orderBy' => 'date'
	);

	$rescent_posts = get_posts( $args );
	
	$posts = '<ul '. get_block_wrapper_attributes() .'>';

	foreach($rescent_posts as $post) {

		$title = get_the_title( $post );
		$title = $title ? $title : __('(No title)', 'latest-posts') ;
		$permalink = get_permalink( $post );
		$excerpt = get_the_excerpt( $post );
		$posts .= '<li>';
		$posts .= '<h4><a href="' .esc_url( $permalink ) . '">' . $title . '</a></h4>';
		$posts .= '<time datetime="' . esc_attr( get_the_date( 'c', $post ) ) . '">' . esc_html( get_the_date( '', $post ) ) . '</time>';

		if(!empty($excerpt)) {
			$posts .= '<p>' . $excerpt . '</p>';
		}

		$posts .= '</li>';
	}

	$posts .= '</ul>';
	echo $posts;

?> -->

