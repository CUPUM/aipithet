import { cn } from '@lib/components/utilities';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';
import React from 'react';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = AccordionPrimitive.Item;

const AccordionTrigger = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ children, className, ...props }, forwardedRef) => (
	<AccordionPrimitive.Header>
		<AccordionPrimitive.Trigger
			{...props}
			className={cn('flex items-center gap-4', className)}
			ref={forwardedRef}
		>
			{children}
			<ChevronDown aria-hidden />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));

const AccordionContent = React.forwardRef<
	React.ElementRef<typeof AccordionPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, className, ...props }, forwardedRef) => (
	<AccordionPrimitive.Content
		{...props}
		className={cn('AccordionContent', className)}
		ref={forwardedRef}
	>
		<div className="AccordionContentText">{children}</div>
	</AccordionPrimitive.Content>
));

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
