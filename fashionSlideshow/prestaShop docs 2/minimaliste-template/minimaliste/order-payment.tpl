{include file=$tpl_dir./thickbox.tpl}
{capture name=path}{l s='Your payment method'}{/capture}
{include file=$tpl_dir./breadcrumb.tpl}
{assign var='current_step' value='payment'}
{include file=$tpl_dir./order-steps.tpl}
{include file=$tpl_dir./errors.tpl}
    <div class="payement-left">
        <h3>{l s='Order Product'}</h3>
        <div class="check-product">
        	{foreach from=$products item=product name=productLoop}
			<div class="check-product-unit">
    			<div style="float: left; width: 100px; text-align: center;">
					<a href="{$link->getProductLink($product.id_product, $product.link_rewrite)|escape:'htmlall,UTF-8'|stripslashes}">
                    <img src="{$img_prod_dir}{$product.id_image}-small.jpg" alt="{$product.name|escape:'htmlall':'UTF-8'}" /></a>            
			    </div>
            <div style="float: left; width: 180px;">
    					<strong style="color:#999999"><a href="{$link->getProductLink($product.id_product, $product.link_rewrite)|escape:'htmlall,UTF-8'|stripslashes}" style="font-size: 12px; margin-bottom: 2px;">{$product.name|escape:'htmlall,UTF-8'|stripslashes}</a></strong><br />
						<span style="font-size: 11px; line-height: 20px;">{$product.manufacturer_name|escape:'htmlall':'UTF-8'}</span>
						{if $product.attributes}
						<span style="font-size:11px;  color:#999999">{$product.attributes|escape:'htmlall,UTF-8'|stripslashes}</span>
						{/if}
				  </div>
					<div style="float: left; width: 70px; text-align: center;">						
						<strong>{l s='Quantity'}</strong>
						<p style="margin-top: 17px;">{$product.quantity|intval}</p>
					</div>
					<div style="float: left;width: 70px; text-align: center; height:62px">
						<strong>{l s='Total'}</strong>
						<p style="margin-top: 17px; font-weight:bold">{convertPrice price=$product.total_wt}</p>
					</div>
                    <br style="clear: both;" />				
				</div>
			{/foreach}
        </div>
        <h3>{l s='Shipping mode'}</h3>
        <div style="width:400px; height: 60px; border: 1px dashed #CCCCCC; vertical-align: middle; padding: 10px 0 0px 23px; background: #FFF;">
        	<table cellpadding="0" cellspacing="0" border="0" width="95%">
				<tr>
					<td style="border: none; padding: 2px 0px; font-size:1.1em"><strong>
						{if $carrier->name == "0"}{$shop_name|escape:'htmlall':'UTF-8'}{else}{$carrier->name|escape:'htmlall':'UTF-8'}{/if} :</strong>
					</td>
					<td style="border: none;" align="right"><strong>{if $total_shipping.price}{convertPrice price=$total_shipping}{else}{l s='Free!'}{/if}</strong></td>
				</tr>
			    <tr {if $total_wrapping == 0} style="display: none;"{/if}>
				    <td style="border: none;"><strong>{l s='Gift packing'} : </strong></td>
				    <td align="right" style="border: none;">
					  <span class="price" style="font-size: 1em;{if $total_wrapping == 0} display: none;{/if}">{convertPrice price=$total_wrapping}</span>
				    </td>
			    </tr>
			</table>
		</div>
        <h3>{l s='Total price'}</h3>
      <div style="width: 400px; height:33px; border: 1px dashed #CCCCCC; vertical-align: middle; padding: 10px 0 0px 23px; background: #FFF;">
            <table width="95%" border="0">
 			{if $discounts}
              <tr>
                <td><strong>{l s='Vouchers total'}</strong></td>
                <td> {convertPrice price=$total_discounts|abs}</td>
              </tr>
				{/if}
              <tr>
                <td><span style="font-size:13px; font-weight:bold">{l s='Order Total'} : </span></td>
                <td align="right"><span style="font-size:15px; font-weight:bold">{convertPrice price=$total_price}</span></td>
              </tr>
            </table>
        </div>
    <h3 class="payement-right-h3">{l s='Adress'}</h3>
     <div class="payement-right">
    		<ul>
                <h3>{l s='Your delivery Adress'}</h3>
    			{if $delivery->company}<li>{$delivery->company}</li>{/if}
    			<li><strong>{$delivery->firstname} {$delivery->lastname}</strong></li>
    			<li>{$delivery->address1}</li>
    			{if $delivery->address2}<li>{$delivery->address2}</li>{/if}
    			<li>{$delivery->postcode} {$delivery->city}</li>
    			<li>{$delivery->country}</li>
    			<li class="address_update" style="margin-left:0px"><a href="{$base_dir_ssl}address.php?id_address={$cart->id_address_delivery|intval}&amp;back=order.php?step=1" title="{l s='Update'}">{l s='Modify this address'}</a></li>
    		</ul>
	  		<ul >
        <h3>{l s='Your billing address'}</h3>
	  			{if $invoice->company}<li>{$invoice->company}</li>{/if}
	  			<li><strong>{$invoice->firstname} {$invoice->lastname}</strong></li>
	  			<li>{$invoice->address1}</li>
	  			{if $invoice->address2}<li>{$invoice->address2}</li>{/if}
	  			<li>{$invoice->postcode} {$invoice->city}</li>
	  			<li>{$invoice->country}</li>
	  			<li class="address_update" style="margin-left:0px"><a href="{$base_dir_ssl}address.php?id_address={$cart->id_address_invoice|intval}&amp;back=order.php?step=1" title="{l s='Update'}">{l s='Modify this address'}</a></li>
	  		</ul>
     </div>
	    <p><p/>
        <h3>{l s='Payment mode'}</h3>
<div id="payment" class="payment-mode">
			<li>{l s='Please choose a payment mode '} : </li>
			{$HOOK_PAYMENT}
		</div>
    </div>
<p class="cart_navigation"><a href="{$base_dir_ssl}order.php?step=2" title="{l s='Previous'}" class="buttonprecedent">{l s='Previous'}</a></p>