import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';
import { format, dateI18n, getSettings } from '@wordpress/date';
import { useSelect } from '@wordpress/data';
import './editor.scss';
import { TextControl } from '@wordpress/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useEffect, useRef } from '@wordpress/element';


export default function Edit( { attributes, setAttributes } ) {   

	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'post', {
				per_page: 5,
				_embed: true,
				order: 'desc',
				orderby: 'date'
			});
		}
	);

	const swiperRef = useRef(null);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Pause autoplay when the component is not in view
                if (swiperRef.current && swiperRef.current.swiper) {
                    swiperRef.current.swiper.autoplay.stop();
                }
            } else {
                // Resume autoplay when the component becomes visible again
                if (swiperRef.current && swiperRef.current.swiper) {
                    swiperRef.current.swiper.autoplay.start();
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.autoplay.start();
        }
    }, [posts]);

    return (
        <div {...useBlockProps()}>
            <Swiper
                ref={swiperRef}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                {posts && posts.map((post) => {

                    const featuredImage = 
				    post._embedded &&
					post._embedded['wp:featuredmedia'] &&
					post._embedded['wp:featuredmedia'].length > 0 &&
					post._embedded['wp:featuredmedia'][0];
                    return(
                        <SwiperSlide key={post.id}>
                        <div className='edb-post-carousel'>

                            {featuredImage && (
						    	<img
						    	    src={featuredImage.source_url}
						    		alt={featuredImage.alt_text}
						    	/> 
						    )}

                            <h4>
                                <a href={post.link}>
                                    {post.title.rendered ? (
                                        <RawHTML>{post.title.rendered}</RawHTML>
                                    ) : (
                                        __('(No title)', 'example-dynamic-block')
                                    )}
                                </a>
                            </h4>
                            {post.date_gmt && (
                                <time dateTime={format('c', post.date_gmt)}>
                                    {dateI18n(
                                        getSettings().formats.date,
                                        post.date_gmt
                                    )}
                                </time>
                            )}
                            {post.excerpt.rendered && (
                                <RawHTML>{post.excerpt.rendered}</RawHTML>
                            )}
                        </div>
                    </SwiperSlide>
                    )
                })}
            </Swiper>
        </div>
    );
};
