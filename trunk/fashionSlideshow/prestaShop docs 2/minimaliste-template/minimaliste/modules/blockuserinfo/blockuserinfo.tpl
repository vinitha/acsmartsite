<!-- Block user information module HEADER -->
<div id="header_user">
 <ul id="header_nav">
   <li id="your_account"><a href="{$base_dir}prices-drop.php" title="">{l s='Specials' mod='blockuserinfo'}</a></li>
   <li id="your_account"><a href="{$base_dir}new-products.php" title="">{l s='New products' mod='blockuserinfo'}</a></li>
   <li id="your_account"><a href="{$base_dir}best-sales.php" title="">{l s='Top sellers' mod='blockuserinfo'}</a></li>
   <li id="your_account"><a href="{$base_dir_ssl}my-account.php" title="{l s='Your Account' mod='blockuserinfo'}">{l s='Your Account' mod='blockuserinfo'}</a></li>
  <li id="shopping_cart">
	<a href="{$base_dir_ssl}order.php" title="{l s='Your Shopping Cart' mod='blockuserinfo'}">{l s='Cart:' mod='blockuserinfo'}</a>
	<span class="ajax_cart_quantity">{if $cart_qties > 0}{$cart_qties}{/if}</span>
	<span class="ajax_cart_no_product {if $cart_qties > 0}hidden{/if}">{l s='0' mod='blockuserinfo'}</span>
   </li>
 </ul>
</div>
<!-- /Block user information module HEADER -->