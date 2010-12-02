<!-- MODULE Block various links -->
<div id="footer">
<!-- Block various links -->
<ul id="variouslink">
 <ul id="footernewsletter">
	<span>{l s='Newsletter'}</span>
	<form action="{$base_dir}" method="post">
	{if $msg}
	<p class="{if $nw_error}warning_inline{else}success_inline{/if}">{$msg}</p>
	{/if}
		<textarea type="text" name="email" size="21" value="{if $value}{$value}{else}{l s='your e-mail' mod='blocknewsletter'}{/if}" onfocus="javascript:if(this.value=='{l s='your e-mail' mod='blocknewsletter'}')this.value='';" onblur="javascript:if(this.value=='')this.value='{l s='your e-mail' mod='blocknewsletter'}';"></textarea>
		<input type="submit" value="ok" name="submitNewsletter" />
	</form>
 </ul>
 <ul id="moreinfo">
	<li><span>{l s='More infos' mod='blockvariouslinks'}</span></li>
	<li><a href="{$base_dir_ssl}cms.php?id_cms=4" title="">{l s='About us' mod='blockvariouslinks'}</a></li>
	<li><a href="{$base_dir_ssl}contact-form.php" title="">{l s='Contact us' mod='blockvariouslinks'}</a></li>
	<li><a href="{$base_dir_ssl}sitemap.php" title="">{l s='Site map' mod='blockvariouslinks'}</a></li>
 </ul>
 <ul id="news">
	<li><span>{l s='New' mod='blockvariouslinks'}</span></li>
	<li><a href="{$base_dir}prices-drop.php" title="">{l s='Specials' mod='blockvariouslinks'}</a></li>
	<li><a href="{$base_dir}new-products.php" title="">{l s='New products' mod='blockvariouslinks'}</a></li>
	<li><a href="{$base_dir}best-sales.php" title="">{l s='Top sellers' mod='blockvariouslinks'}</a></li>
 </ul>
 <ul id="legal">
	<li><span>{l s='Legals' mod='blockvariouslinks'}</span></li>
	<li><a href="{$base_dir}cms.php?id_cms=1" title="">{l s='Delivery' mod='blockvariouslinks'}</a></li>
	<li><a href="{$base_dir}cms.php?id_cms=2" title="">{l s='Legal Notice' mod='blockvariouslinks'}</a></li>
	<li><a href="{$base_dir}cms.php?id_cms=3" title="">{l s='Terms and conditions of use' mod='blockvariouslinks'}</a></li>
 </ul>
</ul>

<!-- Block newsletter payment -->
<ul id="letterpayment">
 <ul id="payment">
	<li>
    <span>
	  <a href="{$link->getCMSLink(5, $securepayment)}">
	   <img src="{$img_dir}logo_paiement_paypal.gif" alt="paypal" />
	   <img src="{$img_dir}logo_paiement_visa.gif" alt="visa" />
	   <img src="{$img_dir}logo_paiement_mastercard.gif" alt="mastercard" />
	  </a>
    </span>
   </li>
  </ul>
 </ul>

</div>
<!-- /MODULE Block various links -->
