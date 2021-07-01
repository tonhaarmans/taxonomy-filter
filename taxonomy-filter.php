<?php

namespace Grav\Plugin;

use Composer\Autoload\ClassLoader;
use Grav\Common\Assets;
use Grav\Common\Plugin;

/**
 * Class TaxonomyFilterPlugin
 * @package Grav\Plugin
 */
class TaxonomyFilterPlugin extends Plugin
{

    /**
     * @return array
     *
     * The getSubscribedEvents() gives the core a list of events
     *     that the plugin wants to listen to. The key of each
     *     array section is the event that the plugin listens to
     *     and the value (in the form of an array) contains the
     *     callable (or function) as well as the priority. The
     *     higher the number the higher the priority.
     */
    public static function getSubscribedEvents(): array
    {
        return [
            'onPluginsInitialized' => [
                // Uncomment following line when plugin requires Grav < 1.7
                // ['autoload', 100000],
                ['onPluginsInitialized', 0]
            ]
        ];
    }

    /**
     * Composer autoload
     *
     * @return ClassLoader
     */
    public function autoload(): ClassLoader
    {
        return require __DIR__ . '/vendor/autoload.php';
    }

    /**
     * Initialize the plugin
     */
    public function onPluginsInitialized(): void
    {
        // Don't proceed if we are in the admin plugin
        if ($this->isAdmin()) {
            return;
        }

        // Enable the main events we are interested in

        if ($this->isOnRoute()) {
            $this->enable([
                // Put your main events here
                'onTwigTemplatePaths' => ['onTwigTemplatePaths', 0],
                'onAssetsInitialized' => ['onAssetsInitialized', 0],
            ]);
        }
    }

    /** 
     * Determine if plugin should be enabled on current route.
     * 
     * @return bool
     */
    public function isOnRoute(): bool
    {
       $path = $this->grav['uri']->path();
        $routes = $this->config->get('plugins.' . $this->name . '.routes');

        $enable = $routes && (
            (gettype($routes) === 'string' && $routes === $path) ||
            (is_array($routes) && in_array($path, $routes)));

        return $enable;
    }

    /**
     * Add current directory to twig lookup paths.
     *
     * @return void
     */
    public function onTwigTemplatePaths(): void
    {
        $this->grav['twig']->twig_paths[] = __DIR__ . "/templates";
    }

    /**
     * Add Javascript and Css to page
     *
     * @return void
     */
    public function onAssetsInitialized(): void
    {
        $isProduction = $this->config->get("plugins.$this->name.isProduction", true);
        $minified = $isProduction ? '.min' : '';

        /** @var Assets */
        $assets = $this->grav['assets'];

        $assets->addCss("plugin://{$this->name}/css/style$minified.css");
        $assets->addJs(
            "plugin://{$this->name}/js/taxonomy-filter$minified.js",
            ['group' => 'head', 'position' => 'after', 'loading' => 'defer']
        );
    }
}
