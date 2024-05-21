import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { RawHTML, useState } from '@wordpress/element';
import { format, dateI18n, getSettings } from '@wordpress/date';
import { useSelect } from '@wordpress/data';
import './editor.scss';
import { ToggleControl, TabPanel, QueryControls } from '@wordpress/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useEffect, useRef } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {   

    const { displayFeaturedImage, carouselAutoplay, carouselInfiniteLoop, PostsToShow, orderBy, order, categories } = attributes;

    const [activeTab, setActiveTab] = useState('card container');

    const catIDs = categories && categories.length > 0 ? categories.map((cat)=> cat.id) : [];

	const posts = useSelect(
		(select) => {
			return select('core').getEntityRecords('postType', 'post', {
				per_page: PostsToShow,
				_embed: true,
				order,
				orderby: orderBy,
				categories: catIDs
			});
		},
        [PostsToShow, order, orderBy, categories]
	);

	const swiperRef = useRef(null)

    const autoplayConfig = carouselAutoplay
        ? {
            delay: 2500,
            disableOnInteraction: false,
        }
        : false; 
    
    const onNumberOfPostChange = (newValue) => {
        setAttributes({ PostsToShow: newValue })
    }

    const allCats = useSelect((select) => {
		return select('core').getEntityRecords('taxonomy', 'category', {
			per_page: -1,
		});
	}, []);

    const catSuggestions = {};
	if (allCats) {
		for (let i = 0; i < allCats.length; i++) {
			const cat = allCats[i];
			catSuggestions[cat.name] = cat;
		}
	}	

    const onCategoryChange = (values) => {
		const hasNoSuggestions = values.some((value) => typeof value == 'string' && !catSuggestions[value]);
		if (hasNoSuggestions) return;

		const updateCats = values.map((token)=> {
			return typeof token == 'string' ? catSuggestions[token] : token;
		})
		
		setAttributes({categories: updateCats})
	}

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            if (carouselAutoplay) {
                swiperRef.current.swiper.autoplay.start();
            } else {
                swiperRef.current.swiper.autoplay.stop();
            }
        }
    }, [carouselAutoplay, posts]);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
            const swiperInstance = swiperRef.current.swiper;

            if (!carouselInfiniteLoop) {
                // Disable loop and reset to the first slide
                swiperInstance.loopDestroy(); // Disable loop
            } else {
                // Enable loop
                swiperInstance.loopCreate(); // Enable loop
            }

            // Ensure pagination updates correctly
            swiperInstance.on('slideChange', () => {
                if (swiperInstance.pagination) {
                    swiperInstance.pagination.update();
                }
            });

            swiperInstance.on('init', () => {
                if (swiperInstance.pagination) {
                    swiperInstance.pagination.render();
                    swiperInstance.pagination.update();
                }
            });

            swiperInstance.update(); // Update Swiper instance

            // Re-initialize Swiper to ensure everything is set correctly
            if (!swiperInstance.initialized) {
                swiperInstance.init();
            }
        }
    }, [carouselInfiniteLoop]);

    return (
        <>

        <InspectorControls>
            
        <TabPanel
            className="pc-tab-panel"
            activeClass="pc-active-tab"
            onSelect={(tabName) => setActiveTab(tabName)}
            activeTab={activeTab}
            tabs={[
                {
                    name: 'general',
                    title: 
                    <span className='pc-tab-panel-title'>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={15}
                          height={15}
                          fill="none"
                        >
                          <path
                            d="M10 10.15a2.613 2.613 0 0 0 2.505-1.87h1.832V6.785h-1.832a2.613 2.613 0 0 0-5.01 0H.803V8.28h6.692A2.613 2.613 0 0 0 10 10.15Zm0-3.74c.617 0 1.122.506 1.122 1.123 0 .616-.505 1.121-1.122 1.121a1.125 1.125 0 0 1-1.122-1.121c0-.617.505-1.122 1.122-1.122Z"
                          />
                          <path
                            d="M5.14 14.45a2.613 2.613 0 0 0 2.505-1.87h6.692v-1.496H7.645a2.613 2.613 0 0 0-5.01 0H.803v1.496h1.832a2.613 2.613 0 0 0 2.505 1.87Zm0-3.74c.617 0 1.121.505 1.121 1.122 0 .617-.504 1.122-1.121 1.122a1.125 1.125 0 0 1-1.122-1.122c0-.617.505-1.122 1.122-1.122ZM5.14 6.037a2.613 2.613 0 0 0 2.505-1.87h6.692V2.673H7.645a2.613 2.613 0 0 0-5.01 0H.803v1.496h1.832A2.613 2.613 0 0 0 5.14 6.037Zm0-3.739c.617 0 1.121.505 1.121 1.122 0 .617-.504 1.121-1.121 1.121A1.125 1.125 0 0 1 4.018 3.42c0-.617.505-1.122 1.122-1.122Z"
                          />
                        </svg>
                         General
                    </span>,
                    className: 'general-tab'
                },
                {
                    name: 'styles',
                    title:  
                    <span className='pc-tab-panel-title'>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={18}
                          height={16}
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9.845 6.994c-.438 0-.876.17-1.21.504-.67.669-1.043 2.67-2.646 3.597 1.914.14 3.635.107 5.068-1.176.704-.631.669-1.752 0-2.421a1.707 1.707 0 0 0-1.21-.504h-.002Z"
                            clipRule="evenodd"
                          />
                          <path
                            d="M15.805 4.928v8.886c0 .184-.218.454-.402.454H1.627c-.184 0-.427-.27-.427-.454V6.947l2.892-.019c.605-.004.902-.22.909-.824l.055-2.84h8.187l1.294-1.348-9.885-.011L0 6.306v7.508c0 .899.728 1.655 1.627 1.655h13.776c.899 0 1.602-.756 1.602-1.655V3.634l-1.2 1.294Z"
                          />
                          <path
                            fillRule="evenodd"
                            d="M17.137 1.393 12 6.531l5.138-5.138Z"
                            clipRule="evenodd"
                          />
                          <path
                            fillRule="evenodd"
                            d="M12 7.393a.863.863 0 0 1-.61-1.472L16.528.784a.863.863 0 0 1 1.22 1.22L12.61 7.14a.86.86 0 0 1-.61.252Z"
                            clipRule="evenodd"
                          />
                        </svg>
                     Styles
                </span>,
                    className: 'style-tab',
                },
            ]}
        >
            { (tab) => (
                <>
                    {tab.name === 'general' && (
                        <div className='pc-tabs-content'>
                            <ToggleControl
                                label={__('Display Featured Image')}
                                onChange={ (v) => {setAttributes({displayFeaturedImage: v})} }
                                checked={displayFeaturedImage}
                            />
                            <ToggleControl
                                label={__('Autoplay')}
                                onChange={ (v) => {setAttributes({carouselAutoplay: v})} }
                                checked={carouselAutoplay}
                            />
                            <ToggleControl
                                label={__('Infinite loop', 'example-dynamic-block')}
                                onChange={ (v) => {setAttributes({carouselInfiniteLoop: v})} }
                                checked={carouselInfiniteLoop}
                            />
                            <QueryControls 
				                numberOfItems={PostsToShow} 
				            	onNumberOfItemsChange={onNumberOfPostChange}
				            	maxItems={15}
				            	minItems={3}
				            	orderBy={orderBy}
				            	onOrderByChange= {(v)=> setAttributes({ orderBy: v })}
				            	order={order}
				            	onOrderChange= {(v)=> setAttributes({ order: v })}
				            	categorySuggestions= {catSuggestions}
				            	selectedCategories={categories}					
				            	onCategoryChange={onCategoryChange}
				            />
                        </div>
                    )}
                    {tab.name === 'styles' && (
                        <div className='pc-tabs-content'>This is styles</div>
                    )}
                </>
            )}
        </TabPanel>

        </InspectorControls>

        <div {...useBlockProps()}>
            <Swiper
                ref={swiperRef}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={autoplayConfig}
                pagination={{
                    clickable: true
                }}
                loop={carouselInfiniteLoop}
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
    
                                {( displayFeaturedImage && featuredImage) && (
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
        </>
    );
};
