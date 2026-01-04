import { DependencyList, useEffect } from "react";

const options = {
  capture: true,
};

type EventHandler = (this: HTMLBodyElement, e: Event) => any;

/**
 * Allow components to listen to a global scroll event.
 *
 * @param builder Contains the event handler and a boolean that controls when
 * the event handler is added.
 * @param deps Extras deps to add to the dependency list.
 */
export default function useBodyScroll(
  builder: {
    handler: EventHandler;
    canListen?: boolean;
  },
  deps: DependencyList = []
) {
  useEffect(() => {
    const { handler, canListen = true } = builder;

    if (canListen) {
      document.body.addEventListener("scroll", handler, options);

      return () => {
        document.body.removeEventListener("scroll", handler, options);
      };
    }
  }, [builder, ...deps]);
}
