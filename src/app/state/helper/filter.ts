import { CardGroupState } from "../model";

export function isNotKudosOnlyGroup(group: CardGroupState) {
  return Object.values(group.cards).find(
    (card) => card.originColumn !== "Kudos",
  );
}
