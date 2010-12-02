<!-- MODULE Block new products -->
<div id="new-products_block_right" class="block products_block">
	<h4><a href="{$base_dir}new-products.php" title="{l s='New products' mod='blocknewproducts'}">{l s='New products' mod='blocknewproducts'}</a></h4>
	<div class="blocknewproducts">
	{if $new_products}
			{foreach from=$new_products item=product name=myLoop}
		{/foreach}
 	  <ul class="blocknewproducts">
			<li class="blocknewproducts">
			 <a href="{$new_products.0.link}">
			  <img src="{$img_prod_dir}{$new_products.0.id_image}-medium.jpg" alt="{$new_products.0.legend|escape:htmlall:'UTF-8'}" />
			 </a>
			</li>
			<li class="li_info">
			<h5>
			  <a href="{$new_products.0.link}" title="{$new_products.0.name|escape:htmlall:'UTF-8'}">{$new_products.0.name|escape:htmlall:'UTF-8'|truncate:20}</a>
			</h5>
			{if $product.description_short}
			 <p class="{if $smarty.foreach.myLoop.first}first_item{elseif $smarty.foreach.myLoop.last}last_item{else}item{/if}">
			  <a href="{$new_products.0.link}">{$new_products.0.description_short|strip_tags:htmlall:'UTF-8'|truncate:50}</a>&nbsp;
			  <a href="{$new_products.0.link}"></a>
			 </p>
			{/if}
			 <span class="new_product_pirce">{displayWtPrice p=$new_products.0.price}</span>
             <a class="linkview" href="{$new_products.0.link}" title="{$product.name|escape:htmlall:'UTF-8'}">{l s='View' mod='blocknewproducts'}</a>			
			 </li>
		</ul>

 	  <ul class="blocknewproducts">
			<li class="blocknewproducts">
			 <a href="{$new_products.1.link}">
			  <img src="{$img_prod_dir}{$new_products.1.id_image}-medium.jpg" alt="{$new_products.1.legend|escape:htmlall:'UTF-8'}" />
			 </a>
			</li>
			<li class="li_info">
			<h5>
			  <a href="{$new_products.0.link}" title="{$new_products.1.name|escape:htmlall:'UTF-8'}">{$new_products.1.name|escape:htmlall:'UTF-8'|truncate:20}</a>
			</h5>
			{if $product.description_short}
			 <p class="{if $smarty.foreach.myLoop.first}first_item{elseif $smarty.foreach.myLoop.last}last_item{else}item{/if}">
			  <a href="{$new_products.1.link}">{$new_products.1.description_short|strip_tags:htmlall:'UTF-8'|truncate:50}</a>&nbsp;
			  <a href="{$new_products.1.link}"></a>
			 </p>
			 {/if}
			 <span class="new_product_pirce">{displayWtPrice p=$new_products.1.price}</span>
              <a class="linkview" href="{$new_products.1.link}" title="{$product.name|escape:htmlall:'UTF-8'}">{l s='View' mod='blocknewproducts'}</a>			
			</li>
		</ul>
		<p class="allnew">
		 <a href="{$base_dir}new-products.php" title="{l s='All new products' mod='blocknewproducts'}">
		  {l s='All new products' mod='blocknewproducts'}
		 </a>
		</p>
	     {else}
		<p>{l s='No new product at this time' mod='blocknewproducts'}</p>
	{/if}
	</div>
</div>
<!-- /MODULE Block new products -->
