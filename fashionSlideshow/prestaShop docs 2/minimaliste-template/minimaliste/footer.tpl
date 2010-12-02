	{if !$content_only}
	</div>
     <!-- Right -->
	 <div id="right_column" class="column">
	  {$HOOK_RIGHT_COLUMN}
	 </div>
     <!-- Footer -->
	 <div id="footer">{$HOOK_FOOTER}</div>
	  <div id="footercopyright">
	   <p>
	    <span>
		  &copy; {l s='Template'} {l s='Minimaliste for'} <a href="http://www.prestashop.com">{l s='PrestaShop'} 1.2</a>
          {l s='by'} <a href="http://dgcraft.free.fr" target="_blank">{l s='DG.Craft'}</a>
	    </span>
	   </p>
      </div>
	</div>
	{/if}
	</body>
</html>