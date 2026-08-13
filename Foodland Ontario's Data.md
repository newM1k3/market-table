# Foodland Ontario's Data
Yes, you can build an app that integrates Foodland Ontario's data, but there are a few critical technical and legal limitations you need to know regarding how you access their databases.
## 1. The Availability Guide Data (Fully Accessible)
If your app needs to track when fruits and vegetables are in season in Ontario, you are in luck. The provincial government provides the Foodland Ontario Fruits and Vegetables Availability Guide as open data. [1] 

* 
* How to access it: You can access this data programmatically using the [Ontario Data Catalogue API](https://data.ontario.ca/about).
* The Rules: It is released under the Open Government Licence – Ontario, which permits you to copy, modify, publish, and use the data commercially in your app, provided you credit the source. [2, 3] 
* 

## 2. The Recipe Database (No Public API)
Unlike the availability guide, the province does not offer a public API or open data download for Foodland Ontario's recipe database. To use their recipes in an app, you have three primary paths: [4, 5] 

* 
* Path A: External Deep-Linking (Easiest & Safest)
Instead of hosting the recipes inside your app, use the Open Data Availability Guide to tell users what is in season. Then, provide a link button that opens the user's browser directly to the corresponding filtered ingredients page on the Foodland Ontario Recipes Portal. [5] 
* Path B: Web Scraping (Technical Risk)
You could write a custom script to scrape recipe data directly from the public Foodland Ontario web pages. However, web scraping has distinct downsides:
* Fragility: If the Ontario government changes its website layout or URL structures, your app's recipe feature will break instantly.
   * Terms of Service: You must review the ontario.ca terms of use, as high-frequency automated scraping can sometimes trigger IP blocking. [4] 
* Path C: Proprietary Curation
Instead of pulling directly from their database, you can hardcode your own curated database of recipes using local Ontario ingredients. You can structure your database format cleanly using open-source tools like [Cooklang](https://cooklang.org/blog/18-open-source-recipe-managers-2026/) to generate your own API endpoints. [6, 7] 
* 

## 3. Trademark Restrictions (The Logo)
While you can use the open-source data, you cannot use the official Foodland Ontario green-and-black logo inside your app's branding, app store icon, or user interface.
As noted in the province's guidelines, the logo is strictly reserved for farmers, processors, and retailers to place on physical packaging or direct points of sale to certify that a food product is genuinely grown in Ontario. Using it in a third-party mobile application would violate their trademark guidelines.
## Summary Action Plan

   1. Pull the raw seasonal calendar data into your app using the [Ontario Data Catalogue CKAN API](https://data.ontario.ca/en/api/1/util/snippet/api_info.html?resource_id=f85f9d64-116d-4169-b887-665cf804d113).
   2. Code your own user interface to show what is fresh this month.
   3. Redirect users to the Foodland Ontario website via custom URLs for the actual cooking steps. [5, 8] 


[1] [https://open.canada.ca](https://open.canada.ca/data/en/dataset/d7b3123b-ccc7-4cd2-ac7b-82717cf6da18/resource/ad34df6a-770a-4ef2-9bfe-96544b860b9b)
[2] [https://open.canada.ca](https://open.canada.ca/data/en/dataset/d7b3123b-ccc7-4cd2-ac7b-82717cf6da18)
[3] [https://data.ontario.ca](https://data.ontario.ca/about)
[4] [https://www.ontario.ca](https://www.ontario.ca/foodland/recipes/browse)
[5] [https://www.ontario.ca](https://www.ontario.ca/foodland/recipes)
[6] [https://cooklang.org](https://cooklang.org/blog/29-building-recipe-api-with-cooklang/)
[7] [https://cooklang.org](https://cooklang.org/blog/18-open-source-recipe-managers-2026/)
[8] [https://data.ontario.ca](https://data.ontario.ca/en/api/1/util/snippet/api_info.html?resource_id=f85f9d64-116d-4169-b887-665cf804d113)

